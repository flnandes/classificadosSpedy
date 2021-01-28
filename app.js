var express = require('express')
var app = express()

var mysql = require('mysql')

	/**
  * Este middleware fornece uma API consistente
  * para conexões MySQL durante o ciclo de vida de solicitação / resposta
  	*/
var myConnection  = require('express-myconnection')
/**
  * Armazene as credenciais do banco de dados em um arquivo config.js separado
  * Carregar o arquivo / módulo e seus valores
  */ 
var config = require('./config')
var dbOptions = {
	host:	  config.database.host,
	user: 	  config.database.user,
	password: config.database.password,
	port: 	  config.database.port, 
	database: config.database.db
}
/**
  * 3 estratégias podem ser usadas
  * single: Cria uma única conexão de banco de dados que nunca é fechada.
  * pool: Cria um pool de conexões. A conexão é liberada automaticamente quando a resposta termina.
  * solicitação: Cria uma nova conexão a cada nova solicitação. A conexão é fechada automaticamente quando a resposta termina.
  */
app.use(myConnection(mysql, dbOptions, 'pool'))

/**
  * configurar o mecanismo de visualização de modelos
  */
app.set('view engine', 'ejs')
/**
  * import routes / index.js
  * import routes / users.js
  */
var index = require('./routes/index')
var users = require('./routes/users')
/**
  * Express Validator Middleware para validação de formulário
  */
var expressValidator = require('express-validator')
app.use(expressValidator())


/**
  * Módulo body-parser é usado para ler dados HTTP POST
  * é um middleware expresso que lê a entrada do formulário
  * e armazene-o como objeto javascript
  */
var bodyParser = require('body-parser')
/**
  * bodyParser.urlencoded () analisa o texto como dados codificados de URL
  * (que é como os navegadores tendem a enviar dados de formulários de formulários regulares configurados para POST)
  * e expõe o objeto resultante (contendo as chaves e valores) em req.body.
  */
app.use(bodyParser.urlencoded({ extended: true }))
app.use(bodyParser.json())
/**
  * Este módulo permite usar verbos HTTP como PUT ou DELETE
  * em locais onde não são suportados
  */
var methodOverride = require('method-override')
/**
  * usando lógica personalizada para substituir o método
  *
  * existem outras maneiras de substituir também
  * como usar cabeçalho e usar valor de consulta
  */
app.use(methodOverride(function (req, res) {
  if (req.body && typeof req.body === 'object' && '_method' in req.body) {
    // olhe em corpos POST codificados por url e exclua-os
    var method = req.body._method
    delete req.body._method
    return method
  }
}))

/**
  * Este módulo mostra mensagens flash
  * geralmente usado para mostrar mensagens de sucesso ou erro
  *
  * As mensagens Flash são armazenadas na sessão
  * Portanto, também temos que instalar e usar
  * analisador de cookies e módulos de sessão
  */
var flash = require('express-flash')
var cookieParser = require('cookie-parser');
var session = require('express-session');

app.use(cookieParser('keyboard cat'))
app.use(session({ 
	secret: 'keyboard cat',
	resave: false,
	saveUninitialized: true,
	cookie: { maxAge: 60000 }
}))
app.use(flash())


app.use('/', index)
app.use('/users', users)

app.listen(3000, function(){
	console.log('Sistema RODANDO na porta:3000')
})
