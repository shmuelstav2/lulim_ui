#!/usr/bin/env python3
"""Cloud archiver for the live-transcribe pages.

Reads every session announced on the registry channel, pulls each session's
lines from its ntfy channel (12h buffer), merges them into data/<session>.json
in this repo, and prints which sessions gained new lines since their last
summary so the calling agent can write a summary into the same file.

Usage:  python3 tools/archive.py            # merge, print sessions needing a summary
        python3 tools/archive.py --set-summary <session> <path-to-json-with he/en>
"""
import json, os, sys, time, urllib.request, datetime

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
DATA = os.path.join(ROOT, 'data')
BASE = 'https://ntfy.sh/lt-7f3a9c-'
os.makedirs(DATA, exist_ok=True)


def fetch(topic):
    url = BASE + topic + '/json?poll=1&since=all'
    with urllib.request.urlopen(url, timeout=30) as r:
        out = []
        for line in r.read().decode('utf-8', 'replace').split('\n'):
            line = line.strip()
            if not line:
                continue
            try:
                m = json.loads(line)
            except Exception:
                continue
            if m.get('event') != 'message':
                continue
            try:
                out.append((m.get('time', 0), json.loads(m.get('message', ''))))
            except Exception:
                pass
        return out


def load(session):
    p = os.path.join(DATA, session + '.json')
    if os.path.exists(p):
        with open(p, encoding='utf-8') as f:
            return json.load(f)
    return {'session': session, 'lines': [], 'summary': None, 'updated': ''}


def save(doc):
    p = os.path.join(DATA, doc['session'] + '.json')
    with open(p, 'w', encoding='utf-8') as f:
        json.dump(doc, f, ensure_ascii=False, indent=0)


def merge_session(session):
    doc = load(session)
    by_id = {l['id']: l for l in doc['lines'] if isinstance(l, dict) and 'id' in l}
    before = len(by_id)
    items = []
    for _, d in fetch(session):
        k = d.get('k')
        if k == 'line' and d.get('id'):
            items.append(d)
        elif k == 'lines':
            items.extend(x for x in d.get('items', []) if isinstance(x, dict) and x.get('id'))
        elif k == 'sum' and d.get('he'):
            cur = doc.get('summary') or {}
            if d.get('count', 0) >= cur.get('count', 0):
                doc['summary'] = {'he': d['he'], 'en': d.get('en', ''), 'at': d.get('at', ''), 'count': d.get('count', 0), 'source': 'page'}
    for l in items:
        by_id[l['id']] = {'id': l['id'], 't': l.get('t', ''), 'en': l.get('en', ''), 'he': l.get('he', '')}
    doc['lines'] = sorted(by_id.values(), key=lambda l: l['id'])
    if len(doc['lines']) != before:
        doc['updated'] = datetime.datetime.utcnow().isoformat(timespec='seconds') + 'Z'
    save(doc)
    return doc, len(doc['lines']) - before


def main():
    if len(sys.argv) >= 4 and sys.argv[1] == '--set-summary':
        doc = load(sys.argv[2])
        with open(sys.argv[3], encoding='utf-8') as f:
            s = json.load(f)
        doc['summary'] = {'he': s['he'], 'en': s.get('en', ''), 'at': datetime.datetime.now(datetime.timezone(datetime.timedelta(hours=-4))).strftime('%H:%M'), 'count': len(doc['lines']), 'source': 'cloud'}
        save(doc)
        print('summary saved for', sys.argv[2])
        return
    sessions = set()
    idx_path = os.path.join(DATA, 'index.json')
    index = {}
    if os.path.exists(idx_path):
        with open(idx_path, encoding='utf-8') as f:
            index = json.load(f)
    sessions.update(index.keys())
    try:
        for _, d in fetch('registry'):
            if d.get('k') == 'session' and d.get('s'):
                sessions.add(d['s'])
                index.setdefault(d['s'], {'first_seen': d.get('at', '')})
    except Exception as e:
        print('registry fetch failed:', e, file=sys.stderr)
    need = []
    for s in sorted(sessions):
        try:
            doc, added = merge_session(s)
        except Exception as e:
            print('session', s, 'failed:', e, file=sys.stderr)
            continue
        index[s] = {**index.get(s, {}), 'lines': len(doc['lines']), 'updated': doc.get('updated', ''), 'summary_count': (doc.get('summary') or {}).get('count', 0)}
        n = len(doc['lines'])
        sc = (doc.get('summary') or {}).get('count', 0)
        if n >= 4 and n - sc >= 6:
            need.append(s)
        print(f'{s}: {n} lines (+{added}), summary covers {sc}')
    with open(idx_path, 'w', encoding='utf-8') as f:
        json.dump(index, f, ensure_ascii=False, indent=1)
    print('NEED_SUMMARY', ' '.join(need))


if __name__ == '__main__':
    main()
