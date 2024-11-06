
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

// Parse application/json
app.use(bodyParser.json());

// Banco de dados em memória
let produtos = [
    { id: 1, nome: 'Camiseta', preco: 50.0, quantidade: 100 },
    { id: 2, nome: 'Calça', preco: 100.0, quantidade: 50 },
];

// Função para encontrar um produto pelo ID
function findProdutoById(id) {
    return produtos.find(p => p.id === id);
}

// Função para verificar se o produto já existe pelo nome
function isProdutoDuplicado(nome) {
    return produtos.some(p => p.nome.toLowerCase() === nome.toLowerCase());
}


app.post('/produtos', (req, res) => {
    const { nome, preco, quantidade } = req.body;

    // Validação de entrada
    if (!nome || typeof nome !== 'string' || nome.trim() === '') {
        return res.status(400).json({ error: 'Nome do produto é obrigatório e deve ser uma string.' });
    }

    if (isProdutoDuplicado(nome)) {
        return res.status(400).json({ error: 'Já existe um produto com esse nome.' });
    }

    if (isNaN(preco) || preco <= 0) {
        return res.status(400).json({ error: 'Preço deve ser um número positivo.' });
    }

    if (isNaN(quantidade) || quantidade < 0) {
        return res.status(400).json({ error: 'Quantidade deve ser um número positivo.' });
    }

    const newProduto = {
        id: produtos.length + 1,
        nome,
        preco,
        quantidade,
    };

    produtos.push(newProduto);
    return res.status(201).json(newProduto);
});


app.get('/produtos', (req, res) => {
    return res.json(produtos);
});


app.put('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const { nome, preco, quantidade } = req.body;

    const produto = findProdutoById(Number(id));
    if (!produto) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    // Validação de dados
    if (nome && isProdutoDuplicado(nome)) {
        return res.status(400).json({ error: 'Já existe um produto com esse nome.' });
    }

    if (preco !== undefined && (isNaN(preco) || preco <= 0)) {
        return res.status(400).json({ error: 'Preço deve ser um número positivo.' });
    }

    if (quantidade !== undefined && (isNaN(quantidade) || quantidade < 0)) {
        return res.status(400).json({ error: 'Quantidade deve ser um número positivo.' });
    }

    if (nome) produto.nome = nome;
    if (preco !== undefined) produto.preco = preco;
    if (quantidade !== undefined) produto.quantidade = quantidade;

    return res.json(produto);
});



app.delete('/produtos/:id', (req, res) => {
    const { id } = req.params;
    const index = produtos.findIndex(p => p.id === Number(id));

    if (index === -1) {
        return res.status(404).json({ error: 'Produto não encontrado.' });
    }

    produtos.splice(index, 1);
    return res.status(204).send();
});





app.get('/relatorio', (req, res) => {
    const totalProdutos = produtos.length;
    const valorTotalEstoque = produtos.reduce((total, produto) => total + produto.preco * produto.quantidade, 0);

    return res.json({
        totalProdutos,
        valorTotalEstoque
    });
});
app.get('/relatorio', (req, res) => {
    const totalProdutos = produtos.length;
    const valorTotalEstoque = produtos.reduce((total, produto) => total + produto.preco * produto.quantidade, 0);

    return res.json({
        totalProdutos,
        valorTotalEstoque
    });
});



POST /produtos
{
    "nome": "Tênis",
    "preco": 120,
    "quantidade": 30
}



GET /produtos/buscar?nome=Camiseta
PUT /produtos/1
{
    "preco": 55.0,
    "quantidade": 120
}


GET /relatorio

