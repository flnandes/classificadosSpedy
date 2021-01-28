var express = require('express')
var app = express()

// MOSTRAR LISTA DE CLASSIFICADOS
app.get('/', function(req, res, next) {
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM classificadosspedy ORDER BY id DESC',function(err, rows, fields) {
			// if (err) jogue err
			if (err) {
				req.flash('error', err)
				res.render('user/listar', {
					title: 'Lista de Classificados', 
					data: ''
				})
			} else {
				// renderizar para o arquivo de modelo views / user / list.ejs
				res.render('user/listar', {
					title: 'Lista de Classificados', 
					data: rows
				})
			}
		})
	})
})

// MOSTRAR FORMULÁRIO DE USUÁRIO ADICIONAL
app.get('/adicionar', function(req, res, next){	
	// renderizar para views / user / add.ejs
	res.render('user/adicionar', {
		title: 'Adicionar NOVO classificado',
		titulo: '',
		dataClas: '',
		descricao: ''		
	})
})

// Adicionar NOVO classificado POST ACTION
app.post('/adicionar', function(req, res, next){	
	req.assert('titulo', 'Titulo é OBRIGATÓRIO!').notEmpty()           // Validar o nome
	req.assert('dataClas', 'Data do Classificado é OBRIGATÓRIO!').notEmpty()             // Validar idade
    req.assert('descricao', 'É necessário uma Descrição').notEmpty()  //Validar email

    var errors = req.validationErrors()
    
    if( !errors ) {  // Nenhum erro foi encontrado. Validação aprovada!

		/*
		* Módulo Express-validator
		
		req.body.comment = 'um <span> comentário </span>';
		req.body.username = 'um usuário';
		
		req.sanitize ('comentário'). escape (); // retorna 'um & lt; span & gt; comentário & lt; / span & gt;'
		req.sanitize ('nome de usuário'). trim (); // retorna 'um usuário'
		*/
		var classificados = {
			titulo: req.sanitize('titulo').escape().trim(),
			dataClas: req.sanitize('dataClas').escape().trim(),
			descricao: req.sanitize('descricao').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('INSERT INTO classificadosspedy SET ?', classificados, function(err, result) {
				// if (err) jogue err
				if (err) {
					req.flash('error', err)
					
					// renderizar para views / user / add.ejs
					res.render('user/adicionar', {
						title: 'Adicionar NOVO classificado',
						titulo: classificados.titulo,
						dataClas: classificados.dataClas,
						descricao: classificados.descricao					
					})
				} else {				
					req.flash('success', 'Classificado ADICIONADO com SUCESSO!')
					
					// renderizar para views / user / add.ejs
					res.render('user/adicionar', {
						title: 'Adicionar NOVO classificado',
						titulo: '',
						dataClas: '',
						descricao: ''					
					})
				}
			})
		})
	}
	else {   // Exibir erros para o usuário
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})				
		req.flash('error', error_msg)		
		
		/**
		* Usando req.body.name
		* porque req.param ('name') está obsoleto
		*/
        res.render('user/adicionar', { 
            title: 'Adicionar NOVO classificado',
            titulo: req.body.titulo,
            dataClas: req.body.dataClas,
            descricao: req.body.descricao
        })
    }
})

// MOSTRAR FORMULÁRIO DE USUÁRIO DO EDITar
app.get('/editar/(:id)', function(req, res, next){
	req.getConnection(function(error, conn) {
		conn.query('SELECT * FROM classificadosspedy WHERE id = ?', [req.params.id], function(err, rows, fields) {
			if(err) throw err
			
			// se o usuário não for encontrado
			if (rows.length <= 0) {
				req.flash('error', 'Usuário não encontrado com id = ' + req.params.id)
				res.redirect('/users')
			}
			else { // se o usuário encontrar
				// renderizar para o arquivo de modelo views / user / edit.ejs
				res.render('user/editar', {
					title: 'Editar Classificado', 
					// dados: linhas [0],
					id: rows[0].id,
					titulo: rows[0].titulo,
					dataClas: rows[0].dataClas,
					descricao: rows[0].descricao
				})
			}			
		})
	})
})

// EDITAR AÇÃO DE POSTAGEM DO USUÁRIO
app.put('/editar/(:id)', function(req, res, next) {
	req.assert('titulo', 'Titulo é obrigatório').notEmpty()           //Validate name
	req.assert('dataClas', 'Data do Classificado é obrigatória').notEmpty()             //Validate age
    req.assert('descricao', 'É necessário uma Descrição').notEmpty()  //Validate email

    var errors = req.validationErrors()
    
    if( !errors ) {   // Nenhum erro foi encontrado. Validação aprovada!

		/*
		* Módulo Express-validator
		
		req.body.comment = 'um <span> comentário </span>';
		req.body.username = 'um usuário';
		
		req.sanitize ('comentário'). escape (); // retorna 'um & lt; span & gt; comentário & lt; / span & gt;'
		req.sanitize ('nome de usuário'). trim (); // retorna 'um usuário'
		*/
		var classificados = {
			titulo: req.sanitize('titulo').escape().trim(),
			dataClas: req.sanitize('dataClas').escape().trim(),
			descricao: req.sanitize('descricao').escape().trim()
		}
		
		req.getConnection(function(error, conn) {
			conn.query('UPDATE classificadosspedy SET ? WHERE id = ' + req.params.id, classificados, function(err, result) {
				// if (err) jogue err
				if (err) {
					req.flash('error', err)
					
					// renderizar para views / user / add.ejs
					res.render('user/editar', {
						title: 'Editar User',
						id: req.params.id,
						titulo: req.body.titulo,
						dataClas: req.body.dataClas,
						descricao: req.body.descricao
					})
				} else {
					req.flash('success', 'Dados atualizados com sucesso!')
					
					// renderizar para views / user / add.ejs
					res.render('user/editar', {
						title: 'Editar User',
						id: req.params.id,
						titulo: req.body.titulo,
						dataClas: req.body.dataClas,
						descricao: req.body.descricao
					})
				}
			})
		})
	}
	else {   // Exibir erros para o usuário
		var error_msg = ''
		errors.forEach(function(error) {
			error_msg += error.msg + '<br>'
		})
		req.flash('error', error_msg)
		
		/*
		* Usando req.body.name
		* porque req.param ('name') está obsoleto
		*/
        res.render('user/editar', { 
            title: 'Editar User',            
			id: req.params.id, 
			titulo: req.body.titulo,
			dataClas: req.body.dataClas,
			descricao: req.body.descricao
        })
    }
})

// DELETAR USUÁRIO
app.delete('/delete/(:id)', function(req, res, next) {
	var classificados = { id: req.params.id }
	
	req.getConnection(function(error, conn) {
		conn.query('DELETE FROM classificadosspedy WHERE id = ' + req.params.id, classificados, function(err, result) {
			// if (err) jogue err
			if (err) {
				req.flash('error', err)
				// redirecionar para a página da lista de usuários
				res.redirect('/users')
			} else {
				req.flash('success', 'Classificado excluído com sucesso! id = ' + req.params.id)
				// redirecionar para a página da lista de usuários
				res.redirect('/users')
			}
		})
	})
})

module.exports = app
