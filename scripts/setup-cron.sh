#!/bin/bash
CRON="*/5 * * * * /root/elviajero-comercio/scripts/health-monitor.sh >> /var/log/viajero-health.log 2>&1"
(crontab -l 2>/dev/null | grep -v "health-monitor"; echo "$CRON") | crontab -
echo "✅ Cron installed"
