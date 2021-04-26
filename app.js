const balanceDisplay = document
  .querySelector('.balance-value')
const incomeDisplay = document
  .querySelector('.money-plus')
const expenceDisplay = document
  .querySelector('.money-minus')
const transactionsDisplay = document
  .querySelector('.transactions')
const form = document.querySelector('form')

let dataLocaStorage
let transactions
let currentID

const updateData = () => {
  dataLocaStorage = JSON.parse(localStorage
    .getItem('transactions'))
  
  currentID = dataLocaStorage.shift().currentID
  transactions = dataLocaStorage !== null 
    ? dataLocaStorage : []
}

// Informações calculadas

const getIncomes = transactionsAmounts =>
  transactionsAmounts
    .filter(value => value > 0)
    .reduce((acc, value) => acc + value, 0)
    .toFixed(2)

const getExpences = transactionsAmounts =>
  transactionsAmounts
    .filter(value => value < 0)
    .reduce((acc, value) => acc - value, 0)
    .toFixed(2)

const getBalance = transactionsAmounts =>
  transactionsAmounts
    .reduce((acc, amount) => acc + amount, 0)
    .toFixed(2)

const getTemplate = () => transactions.map(item => {
  const { id, name, amount } = item
  const amountClass = amount > 0 ? 'plus' : 'minus'
  
  return `
    <li class="transactions-item ${ amountClass }">
      
      <p class="transactions-name">${ name }</p>
      <p class="transactions-amount">
        ${ amount > 0 ? `R$${ amount }` : 
          `- R$${ Math.abs(amount) }`
        }
      </p>
      <button
        class="btn-remove"
        onClick="removeData(${ id })">X</button>
    </li> 
  `
}).join('')

const addInfoInToDOM = () => {
  const transactionsAmounts = transactions
    .map(({ amount }) => amount)
  
  const balance = getBalance(transactionsAmounts)
  const incomes = getIncomes(transactionsAmounts)
  const expences = getExpences(transactionsAmounts)
  
  balanceDisplay.innerHTML = `R$${ balance }`
  incomeDisplay.innerHTML = `R$${ incomes }`
  expenceDisplay.innerHTML = `R$${ expences }`
}

const addTransactionsInToDOM = () => {
  const template = getTemplate()
  transactionsDisplay.innerHTML = template
}

const updateDisplay = () => {
  addInfoInToDOM()
  addTransactionsInToDOM()
}

const updateLocalStorage = () => {
  const data = transactions
  data.unshift({ currentID })
  localStorage
    .setItem('transactions', JSON.stringify(data))
}

const updateDOM = () => {
  updateData()
  updateDisplay()
}

const saveData = (inpName, inpAmount) => {
  currentID++
  const data = {
    id: currentID,
    name: inpName,
    amount: Number(inpAmount)
  }
  transactions.push(data)
  updateLocalStorage()
  updateDOM()
}

const removeData = ID => {
  transactions = transactions
    .filter(item => item.id !== ID)
  updateLocalStorage()
  updateDOM()
}

const handleSubmit = event => {
  event.preventDefault()
  
  const inputName = event.target
    .querySelector('#transaction-name')
  const inputAmount = event.target
    .querySelector('#transaction-amount')
  
  saveData(inputName.value, inputAmount.value)
  
  inputName.value = ''
  inputAmount.value = ''
}

form.addEventListener('submit', handleSubmit)
window.addEventListener('load', updateDOM)