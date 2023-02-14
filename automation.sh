#!/bin/bash

# shellcheck disable=SC2164
cd node/bin

source activate

cd ../../
cd static/assets/scss/
sass -w main.scss:main.css
