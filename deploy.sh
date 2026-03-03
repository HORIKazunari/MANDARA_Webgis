#!/usr/bin/env bash
set -euo pipefail

REMOTE_HOST="webgis.celas.osaka-u.ac.jp"
REMOTE_USER="hori"
REMOTE_DOCROOT="/var/www/html"
REMOTE_BACKUP_ROOT="/var/www/backup"
LOCAL_DIST_DIR="dist"
SKIP_BUILD=1
ASSUME_YES=0

usage() {
  cat <<EOF
Usage: ./deploy.sh [options]

Options:
  --build                 Run npm run build before deployment
  --host <host>           Remote host (default: ${REMOTE_HOST})
  --user <user>           Remote user (default: ${REMOTE_USER})
  --docroot <path>        Remote Apache docroot (default: ${REMOTE_DOCROOT})
  --dist <path>           Local dist directory (default: ${LOCAL_DIST_DIR})
  --yes                   Skip confirmation prompt
  -h, --help              Show this help
EOF
}

while [[ $# -gt 0 ]]; do
  case "$1" in
    --build)
      SKIP_BUILD=0
      shift
      ;;
    --host)
      REMOTE_HOST="$2"
      shift 2
      ;;
    --user)
      REMOTE_USER="$2"
      shift 2
      ;;
    --docroot)
      REMOTE_DOCROOT="$2"
      shift 2
      ;;
    --dist)
      LOCAL_DIST_DIR="$2"
      shift 2
      ;;
    --yes)
      ASSUME_YES=1
      shift
      ;;
    -h|--help)
      usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1" >&2
      usage
      exit 1
      ;;
  esac
done

if [[ "$SKIP_BUILD" -eq 0 ]]; then
  npm run build
fi

if [[ ! -d "$LOCAL_DIST_DIR" ]]; then
  echo "Local dist directory not found: $LOCAL_DIST_DIR" >&2
  exit 1
fi

if [[ "$ASSUME_YES" -ne 1 ]]; then
  echo "Deploy settings:"
  echo "  Local dist:  $LOCAL_DIST_DIR"
  echo "  Remote:      ${REMOTE_USER}@${REMOTE_HOST}"
  echo "  Docroot:     ${REMOTE_DOCROOT}"
  read -r -p "Continue deployment? [y/N] " ans
  if [[ ! "$ans" =~ ^[Yy]$ ]]; then
    echo "Deployment canceled."
    exit 0
  fi
fi

TS="$(date +%Y%m%d_%H%M%S)"
REMOTE_TMP="~/deploy_${TS}"
SSH_TARGET="${REMOTE_USER}@${REMOTE_HOST}"

echo "[1/4] Preparing remote temporary directory..."
ssh "$SSH_TARGET" "mkdir -p ${REMOTE_TMP}"

echo "[2/4] Uploading ${LOCAL_DIST_DIR} to remote temporary directory..."
rsync -avz --delete "${LOCAL_DIST_DIR}/" "${SSH_TARGET}:${REMOTE_TMP}/dist/"

echo "[3/4] Applying deployment on remote server (backup + sync + permissions + reload)..."
ssh -t "$SSH_TARGET" "bash -s" -- "$REMOTE_TMP" "$REMOTE_DOCROOT" "$REMOTE_BACKUP_ROOT" <<'EOF'
set -euo pipefail
REMOTE_TMP_DIR="$1"
REMOTE_DOCROOT_DIR="$2"
REMOTE_BACKUP_DIR="$3"
NOW="$(date +%Y%m%d_%H%M%S)"
sudo mkdir -p "$REMOTE_BACKUP_DIR"
sudo rsync -a "${REMOTE_DOCROOT_DIR}/" "${REMOTE_BACKUP_DIR}/html_${NOW}/"
sudo rsync -av --delete "${REMOTE_TMP_DIR}/dist/" "${REMOTE_DOCROOT_DIR}/"
sudo chown -R root:root "$REMOTE_DOCROOT_DIR"
sudo find "$REMOTE_DOCROOT_DIR" -type d -exec chmod 755 {} \;
sudo find "$REMOTE_DOCROOT_DIR" -type f -exec chmod 644 {} \;
sudo apache2ctl configtest
if sudo systemctl is-active --quiet apache2; then
  sudo systemctl reload apache2
else
  sudo systemctl start apache2
fi
EOF

echo "[4/4] Cleaning up remote temporary directory..."
ssh "$SSH_TARGET" "rm -rf ${REMOTE_TMP}"

echo "Deployment completed: https://${REMOTE_HOST}"