#!/bin/bash
SERVICES="elviajero-comercio_web"
for svc in $SERVICES; do
  REPLICAS=$(docker service ls --filter name=$svc --format "{{.Replicas}}" 2>/dev/null)
  READY=$(echo "$REPLICAS" | cut -d'/' -f1)
  DESIRED=$(echo "$REPLICAS" | cut -d'/' -f2)
  if [ "$READY" != "$DESIRED" ]; then
    echo "[$(date)] ALERT: $svc — $READY/$DESIRED replicas"
  fi
done
docker system prune -f --filter "until=168h" 2>/dev/null
for container in $(docker ps -q); do
  LOGFILE=$(docker inspect "$container" --format '{{.LogPath}}' 2>/dev/null)
  if [ -n "$LOGFILE" ] && [ -f "$LOGFILE" ]; then
    SIZE=$(stat -c%s "$LOGFILE" 2>/dev/null || echo 0)
    [ "$SIZE" -gt 10485760 ] && truncate -s 0 "$LOGFILE"
  fi
done
