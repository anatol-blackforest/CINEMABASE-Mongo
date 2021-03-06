// сводим модули
const config = require('./config');
const list = require('./list');
const add = require('./add');
const page = require('./page');
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
const db = require('./mongodb');

module.exports = {
    db,
    config, 
    list, 
    add, 
    page,
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
