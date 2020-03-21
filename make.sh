#!/bin/bash

set -e

function install {
    npm install --prefix ./www/backend --production=false && \
    npm install --prefix ./www/frontend --production=false
}

function build {
    npm run build --prefix ./www/backend && \
    npm run build --prefix ./www/frontend
}

function start {
    npm start --prefix ./www/backend
}

function usage {
    echo "# Usage: $0 [options...]"
    echo "  -h, --help                          Show help"
    echo "  install                             Install dependencies"
    echo "  build                               Build project"
    echo "  start                               Start project"
    exit 0
}

function main {
    if [[ "$#" -eq 0 || "$1" == "--help" || "$1" == "-h" ]]
    then usage
    fi

    local action=""

    if [[ "$1" == "install" || "$1" == "build" || "$1" == "start" ]]
    then action="$1"
    else usage
    fi

    shift

    case "$action" in
        install)
            install
            ;;
        build)
            build
            ;;
        start)
            start
            ;;
    esac
}

main $@
