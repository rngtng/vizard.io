#!/bin/bash

HEALTHY_RESPONSE="\"YES\""
RETRY_ATTEMPTS=5
RETRY_INTERVAL=5

deploy() {
  local number_of_instances="$1"
  local process_type="$2"

  echo "Scaling up 1 instance"
  local revision=$(scale_up 1 ${process_type} | revision_from_scale_up)

  echo "Fetching url for ${revision}"
  local base_url=$(url_for ${revision} ${process_type})

  echo "Checking the health url ${base_url}/-/health"
  is_healthy "${base_url}/-/health"
  local health=$?
  if [ ${health} -eq 0 ] ; then
    fail ${revision} ${process_type}
  fi
  echo "The application is healthy"

  echo "Scaling up a total of ${number_of_instances} instances"
  local revision=$(scale_up ${number_of_instances} ${process_type} | revision_from_scale_up)

  echo "Scaling down all applications (type ${process_type}), but ${revision}"
  scale_down_all_except ${revision} ${process_type}
}

scale_up() {
  local number_of_instances="$1"
  local process_type="$2"
  echo "$(bazooka scale -n $number_of_instances $process_type)"
}

url_for() {
  local revision_number="$1"
  local process_type="$2"

  local revision_information=$(all_instances |
                               find_revision ${revision_number} |
                               instances ${process_type} |
                               first)
  local host=$(host_from "${revision_information}")
  local port=$(port_from "${revision_information}")

  echo "${host}:${port}"
}

is_healthy() {
  local url="$1"

  for i in $(seq "${RETRY_ATTEMPTS}")
  do
    local response=$(curl -s ${url})
    if [ "${response}" = "${HEALTHY_RESPONSE}" ]; then
      return 1
    fi

    sleep "${RETRY_INTERVAL}"
  done

  return 0
}

scale_down_all_except() {
  local revision_number="$1"
  local process_type="$2"

  for revision in $(all_instances |
                    instances ${process_type} |
                    revision_from_ps |
                    except ${revision_number});
  do
    scale_down ${revision} ${process_type}
  done
}

scale_down() {
  local revision="$1"
  local process_type="$2"

  bazooka scale -n 0 -r ${revision} ${process_type}
}

fail() {
  local revision="$1"
  local process_type="$2"

  echo "The application is not healthy. The health page did not return a successful response."
  scale_down ${revision} ${process_type}
  exit 1
}

compress_spaces() {
  sed "s/[ ]\{2,\}/ /g"
}

all_instances() {
  bazooka ps | compress_spaces
}

find_revision() {
  grep "$1"
}

host_from() {
  echo "$1" | cut -d' ' -f7
}

port_from() {
  echo "$1" | cut -d' ' -f6
}

revision_from_ps() {
  cut -d' ' -f4
}

revision_from_scale_up() {
  cut -f1 | cut -d'@' -f2
}

except() {
  grep -v "$1"
}

instances() {
  local process_type="$1"

  grep ${process_type} | grep running
}

first() {
  head -n 1
}

deploy "$@"
