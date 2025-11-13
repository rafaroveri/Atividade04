# Exercício 01: Alpine com MOTD

## 🎯 Objetivo

Criar uma imagem Docker baseada em Alpine Linux que exibe uma mensagem personalizada (MOTD - Message of the Day) ao iniciar.

## 📦 O que será criado

- Imagem Alpine customizada com `bash` e `curl`
- Mensagem de boas-vindas personalizada
- Shell interativo pronto para uso

## 🔨 Como executar

### Build da imagem

```bash
docker build -t cafe:1 .
```

### Executar container interativo

```bash
docker run -it --rm cafe:1
```

Ao iniciar, você verá a mensagem do arquivo `motd.txt` e entrará em um shell bash.

### Usando o Makefile (raiz do projeto)

```bash
make ex01
```

## ✅ Critérios de aceite

- [ ] Imagem constrói sem erros
- [ ] Mensagem MOTD é exibida ao iniciar o container
- [ ] Shell bash está disponível e funcional
- [ ] Comando `curl` está instalado e funciona

## 💡 Conceitos aprendidos

- Uso de Alpine Linux como base mínima
- Instalação de pacotes com `apk`
- Customização de mensagens de inicialização
- Containers interativos vs. daemon

## 🔍 Teste adicional

Dentro do container, teste:

```bash
curl --version
bash --version
cat /motd.txt
```

Todos devem funcionar corretamente.
