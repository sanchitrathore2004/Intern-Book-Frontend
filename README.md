Cloning the frontend repository along with the web-client submodule
`git clone --recurse-submodules https://github.com/sanchitrathore2004/Intern-Book-Frontend`

Generate API calling functions and models
`pnpm generate`

When there is some potty in web-client
`rm -rf web-client\`
`git submodule update --remote --recursive`