// сводим модули
const config = require('./config');
const list = require('./list');
const add = require('./add');
const change = require('./change');
const deleting = require('./delete');
const uploader = require('./uploader');
const onefilm = require('./onefilm');
const search = require('./search');
const crypto = require('./crypto');
const render = require('./render');
const install = require('./install');
const getAccount = require('./getaccount');
const messages = require('./messages');
const postUploader = require('./postuploader');
const formHandler = require('./formhandler');

module.exports = {
    config, 
    list, 
    add, 
    change, 
    deleting, 
    uploader, 
    onefilm, 
    search, 
    crypto, 
    render, 
    install, 
    getAccount, 
    messages, 
    postUploader, 
    formHandler
}
