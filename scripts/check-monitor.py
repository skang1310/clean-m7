#!/usr/bin/env python3
"""Read-only local connection check; never changes monitor settings."""
import argparse, ipaddress, json, socket, urllib.request
p=argparse.ArgumentParser()
p.add_argument('ip',help='Monitor IP from Network Status → IP Settings')
a=p.parse_args()
try: ip=ipaddress.ip_address(a.ip)
except ValueError: p.error('Enter a numeric IP address.')
local_ranges=[ipaddress.ip_network(x) for x in ('10.0.0.0/8','172.16.0.0/12','192.168.0.0/16')]
if not any(ip in n for n in local_ranges): p.error('Use the monitor’s private LAN address, not its public internet IP.')
for port,label in [(26101,'Samsung developer connection'),(8001,'Samsung local device API')]:
 try:
  with socket.create_connection((str(ip),port),timeout=3): print(f'{label}: reachable ({port})')
 except OSError as e: print(f'{label}: unavailable ({e})')
try:
 with urllib.request.urlopen(f'http://{ip}:8001/api/v2/',timeout=3) as r:
  d=json.load(r).get('device',{})
  print(json.dumps({k:d.get(k) for k in ('name','modelName','model','firmwareVersion','OS')},indent=2))
except Exception as e: print(f'Device information unavailable: {e}')
