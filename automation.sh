#!/bin/bash

# shellcheck disable=SC2164
cd node/bin

source activate

cd ../../
cd static/assets/scss/
sass -w home.scss:home.css
