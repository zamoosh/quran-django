#!/bin/bash

# shellcheck disable=SC2164
cd node/bin

source activate

cd ../../
cd static/assets/scss/
sass --watch static/assets/scss:static/assets/css
