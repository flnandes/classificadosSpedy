var express = require('express')
var app = express()

app.get('/', function(req, res) {
	// renderizar para o arquivo de modelo views / index.ejs
	res.render('index', {title: 'Projeto Classificados Spedy'})
})

/** 
 *Atribuímos objeto de aplicativo a module.exports
  *
  * module.exports expõe o objeto do aplicativo como um módulo
  *
  * module.exports deve ser usado para retornar o objeto
  * quando este arquivo é necessário em outro módulo como app.js
 */ 
module.exports = app;
