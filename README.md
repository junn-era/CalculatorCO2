# 🍃 Calculadora de Emissão de CO₂

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=for-the-badge&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=for-the-badge&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=for-the-badge&logo=javascript&logoColor=black)
![Eco-Friendly](https://img.shields.io/badge/Eco%20Friendly-00B050?style=for-the-badge&logo=leaf&logoColor=white)

> Uma calculadora interativa para calcular o impacto ambiental de suas viagens e descobrir formas de compensar suas emissões de carbono.

## 📋 Sumário

- [Sobre o Projeto](#sobre-o-projeto)
- [Funcionalidades](#funcionalidades)
- [Como Funciona](#como-funciona)
- [Estrutura do Projeto](#estrutura-do-projeto)
- [Tecnologias Utilizadas](#tecnologias-utilizadas)
- [Como Usar](#como-usar)
- [Métodos Disponíveis](#métodos-disponíveis)
- [Melhorias Futuras](#melhorias-futuras)
- [Autor](#autor)

## 🌍 Sobre o Projeto

A **Calculadora de Emissão de CO₂** é uma aplicação web interativa desenvolvida para conscientizar sobre o impacto ambiental das viagens. O projeto permite:

- Calcular emissões de carbono com base na distância e modo de transporte
- Comparar diferentes meios de transporte
- Entender o impacto relativo em relação ao carro
- Estimar o custo de créditos de carbono para compensação

## ✨ Funcionalidades

- **🗺️ Cálculo de Rota**: Selecione origem e destino entre as principais cidades brasileiras
- **📏 Distância Automática**: O sistema preenche automaticamente a distância entre cidades conhecidas
- **🚗 Múltiplos Modos de Transporte**: Compare Bicicleta, Carro, Ônibus e Caminhão
- **📊 Comparação Visual**: Veja graficamente como cada modo se compara ao carro
- **🌍 Créditos de Carbono**: Calcule quantos créditos são necessários para compensar as emissões
- **💰 Estimativa de Preço**: Visualize o custo estimado em reais para compensação
- **📱 Responsivo**: Funciona perfeitamente em desktop e dispositivos móveis

## 🔧 Como Funciona

### Passo 1: Seleção de Cidades

O usuário seleciona a cidade de origem e destino a partir de uma lista de 40+ cidades principais brasileiras com suporte a autocomplete.

### Passo 2: Distância (Automática ou Manual)

- **Automática**: Se a rota existe no banco de dados, a distância é preenchida automaticamente
- **Manual**: O usuário pode marcar a checkbox para inserir a distância manualmente

### Passo 3: Modo de Transporte

Selecione entre 4 opções visuais com emojis:
- 🚲 Bicicleta (0 kg CO₂/km)
- 🚘 Carro (0.12 kg CO₂/km)
- 🚌 Ônibus (0.089 kg CO₂/km)
- 🚛 Caminhão (0.96 kg CO₂/km)

### Passo 4: Cálculo

Ao clicar em "Calcular Emissão":
1. Validação de todos os campos
2. Cálculo da emissão para o modo selecionado
3. Cálculo da emissão baseline (carro)
4. Cálculo de economia comparada ao carro
5. Cálculo para todos os modos
6. Estimativa de créditos de carbono e preço

### Passo 5: Visualização de Resultados
Os resultados são exibidos em 3 seções:
- **Resultado da Emissão**: Cards com informações da rota e emissão
- **Comparação de Emissões**: Todos os modos com barras de progresso coloridas
- **Créditos de Carbono**: Quantidade necessária e estimativa de preço

## 📁 Estrutura do Projeto

```
projectCarbonCalc/
├── index.html              # Página principal
├── routesDB.js            # Base de dados de rotas brasileiras
├── css/
│   └── style.css          # Estilos (responsivo e profissional)
├── js/
│   ├── config.js          # Configurações globais
│   ├── calculator.js      # Lógica de cálculos
│   ├── ui.js              # Renderização de componentes
│   └── app.js             # Inicialização e manipulação de eventos
└── README.md              # Este arquivo
```

## 🛠️ Tecnologias Utilizadas

### Frontend

- **HTML5**: Estrutura semântica
- **CSS3**: Estilos responsivos com variáveis CSS e gradientes
- **Vanilla JavaScript ES6+**: Sem dependências externas
  - Arrow functions
  - Template literals
  - Classes e objetos globais
  - Event listeners

### Conceitos

- BEM (Block Element Modifier) para nomenclatura CSS
- Design responsivo (Mobile First)
- Temas de cores eco-friendly
- Animações suaves (transições CSS)

## 🚀 Como Usar

### 1. Abrir a Aplicação

Abra o arquivo `index.html` em um navegador web moderno:
- Chrome/Edge/Firefox (últimas versões)
- Safari 12+

### 2. Preencher o Formulário
```
1. Selecione "Rio de Janeiro, RJ" em Origem
2. Selecione "São Paulo, SP" em Destino
3. Distância será preenchida automaticamente: 430 km
4. Escolha o modo de transporte (ex: Ônibus)
5. Clique em "Calcular Emissão"
```

### 3. Analisar Resultados

- Veja a emissão para o modo escolhido
- Compare com outros modos
- Confira quanto você economizaria usando alternativas
- Saiba quanto precisa de créditos de carbono

## 📚 Métodos Disponíveis

### RoutesDB

```javascript
// Retorna array com todas as cidades únicas (ordenado)
RoutesDB.getAllCities()

// Encontra distância entre duas cidades (ambos os sentidos)
RoutesDB.findDistance("São Paulo, SP", "Rio de Janeiro, RJ") // 430
```

### Calculator

```javascript
// Calcula emissão de um modo para uma distância
Calculator.calculateEmission(430, "car") // 51.6

// Calcula para todos os modos com comparação
Calculator.calculateAllModes(430)
// Retorna: [{mode: 'bicycle', emission: 0, percentVsCar: 0}, ...]

// Calcula economia comparada ao baseline
Calculator.calculateSavings(51.6, 51.6) // {savedKg: 0, percentage: 0}

// Converte kg CO₂ em créditos de carbono
Calculator.calculateCarbonCredits(51.6) // 0.0516

// Estima preço dos créditos em reais
Calculator.estimatedCreditPrice(0.0516) // {min: 2.58, max: 7.74, average: 5.16}
```

### UI

```javascript
// Utilitários de formatação
UI.formatNumber(1234.567, 2)      // "1.234,57"
UI.formatCurrency(100)             // "R$ 100,00"

// Manipulação de elementos
UI.showElement("results")          // Remove classe 'hidden'
UI.hideElement("results")          // Adiciona classe 'hidden'
UI.scrollToElement("results")      // Scroll suave

// Renderização
UI.renderResults(data)             // Retorna HTML dos resultados
UI.renderComparison(modes, mode)   // Retorna HTML da comparação
UI.renderCarbonCredits(credits)    // Retorna HTML dos créditos

// Estados de loading
UI.showLoading(button)             // Mostra spinner
UI.hideLoading(button)             // Remove spinner
```

### CONFIG

```javascript
// Fatores de emissão (kg CO₂/km)
CONFIG.EMISSION_FACTORS // {bicycle: 0, car: 0.12, bus: 0.089, truck: 0.96}

// Dados dos modos de transporte

CONFIG.TRANSPORT_MODES // {bicycle: {label: "...", icon: "🚲", color: "#..."}, ...}

// Configuração de créditos de carbono

CONFIG.CARBON_CREDIT // {KG_PER_CREDIT: 1000, PRICE_MIN_BRL: 50, PRICE_MAX_BRL: 150}

// Funções

CONFIG.populateDatalist()          // Preenche datalist com cidades
CONFIG.setupDistanceAutofill()     // Configura preenchimento automático
```

## 🎨 Design System

### Paleta de Cores

- **Primária**: #10b981 (Verde - Eco-friendly)
- **Secundária**: #059669 (Verde escuro)
- **Accent**: #34d399 (Verde claro)
- **Info**: #3b82f6 (Azul)
- **Danger**: #ef4444 (Vermelho)
- **Warning**: #f59e0b (Laranja)

### Espaçamento

- xs: 0.5rem
- sm: 0.75rem
- md: 1rem
- lg: 1.5rem
- xl: 2rem
- 2xl: 2.5rem
- 3xl: 3rem

## 📈 Melhorias Futuras

- [ ] Integração com API real de rotas (Google Maps, Open Route Service)
- [ ] Autenticação de usuários
- [ ] Histórico de cálculos
- [ ] Compartilhamento em redes sociais
- [ ] Integração com plataformas de créditos de carbono
- [ ] Gráficos mais avançados (Chart.js)
- [ ] Modo escuro
- [ ] Suporte a mais idiomas
- [ ] PWA (Progressive Web App)
- [ ] Offline support

## 🌱 Dados do Projeto

### Rotas Incluídas

- **40+** rotas brasileiras principais
- Conexões **capital para capital**
- Rotas regionais de **todas as 5 regiões**
- Distâncias aproximadas em quilômetros

### Fatores de Emissão

Baseados em estudos de pegada de carbono:
- Bicicleta: 0 kg CO₂/km
- Ônibus: 0.089 kg CO₂/km (mais sustentável)
- Carro: 0.12 kg CO₂/km
- Caminhão: 0.96 kg CO₂/km (maior impacto)

### Créditos de Carbono

- 1 crédito = 1.000 kg CO₂
- Preço: R$ 50 - R$ 150 por crédito
- Valores para compensação de carbono

## 📝 Notas de Desenvolvimento

### Estrutura de Código

O projeto segue princípios de:
- **Modularidade**: Cada arquivo tem responsabilidade única
- **Separação de Conceitos**: HTML, CSS e JS independentes
- **Sem Dependências**: Vanilla JavaScript puro
- **Performance**: Cálculos rápidos e otimizados
- **Acessibilidade**: Semântica HTML apropriada

### Convenções

- CSS: BEM Methodology
- JavaScript: camelCase para variáveis e funções
- Comentários em português
- Documentação JSDoc para funções

## 👨‍💻 Colaborador

**Francisco Júnior**
- LinkedIn: https://www.linkedin.com/in/francisco-de-oliveira-dev/
- Projeto: GitHub Copilot | DIO | 
- CarbonCalc | EcoTrip | Simulador de Impacto Ambiental para Viagens

---

## 📄 Licença

Este projeto é de código aberto e está disponível para fins educacionais.

## 🤝 Contribuições

Sugestões e melhorias são bem-vindas! Sinta-se livre para:

- Reportar bugs
- Sugerir novas funcionalidades
- Melhorar a documentação
- Adicionar novas rotas

---

**Desenvolvido para fins de aprendizado e um futuro mais sustentável.**

🌍 Calcule seu impacto. Reduza suas emissões. Contribua para o planeta.
