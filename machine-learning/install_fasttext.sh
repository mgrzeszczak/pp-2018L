#!/bin/bash
git clone https://github.com/facebookresearch/fastText.git
cd fastText
pip install .
cd ..
rm -rf fastText
