'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 450, -400, 3000, -650, -130, 70, 1300],
    interestRate: 1.2, // %
    pin: 1111,
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,
};

const account3 = {
    owner: 'Steven Thomas Williams',
    movements: [200, -200, 340, -300, -20, 50, 400, -460],
    interestRate: 0.7,
    pin: 3333,
};

const account4 = {
    owner: 'Sarah Smith',
    movements: [430, 1000, 700, 50, 90],
    interestRate: 1,
    pin: 4444,
};

const accounts = [account1, account2, account3, account4];

// Elements
const labelWelcome = document.querySelector('.welcome');
const labelDate = document.querySelector('.date');
const labelBalance = document.querySelector('.balance__value');
const labelSumIn = document.querySelector('.summary__value--in');
const labelSumOut = document.querySelector('.summary__value--out');
const labelSumInterest = document.querySelector('.summary__value--interest');
const labelTimer = document.querySelector('.timer');

const containerApp = document.querySelector('.app');
const containerMovements = document.querySelector('.movements');

const btnLogin = document.querySelector('.login__btn');
const btnTransfer = document.querySelector('.form__btn--transfer');
const btnLoan = document.querySelector('.form__btn--loan');
const btnClose = document.querySelector('.form__btn--close');
const btnSort = document.querySelector('.btn--sort');

const inputLoginUsername = document.querySelector('.login__input--user');
const inputLoginPin = document.querySelector('.login__input--pin');
const inputTransferTo = document.querySelector('.form__input--to');
const inputTransferAmount = document.querySelector('.form__input--amount');
const inputLoanAmount = document.querySelector('.form__input--loan-amount');
const inputCloseUsername = document.querySelector('.form__input--user');
const inputClosePin = document.querySelector('.form__input--pin');

const displayMovements = function(movements) {
    containerMovements.innerHTML = ''; //to clear data displayed previously

    movements.forEach(function(move, i) {
        const type = move > 0 ? 'deposit' : 'withdrawal';

        const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
            <div class="movements__value">${move}€</div>
        </div>`;

        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};
displayMovements(account1.movements);

const calcDisplayBalance = function(movements) {
    const balance = movements.reduce((acc, curr) => acc + curr, 0);

    labelBalance.textContent = `${balance}€`;
};
calcDisplayBalance(account1.movements);

const calcDisplaySummary = function(movements) {
    const incomes = movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);

    labelSumIn.textContent = `${incomes}€`;

    const out = movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov, 0);

    labelSumOut.textContent = `${Math.abs(out)}€`;

    const interest = movements
        .filter(mov => mov > 0)
        .map(deposit => (deposit * 1.2) / 100)
        .filter(int => int >= 1)
        .reduce((acc, int) => acc + int, 0);

    labelSumInterest.textContent = `${interest}€`;
};
calcDisplaySummary(account1.movements);

const createUserNames = function(accs) {
    accs.forEach(function(acc) {
        acc.username = acc.owner
            .toLowerCase()
            .split(' ')
            .map(name => name[0])
            .join('');
    });
};

createUserNames(accounts);

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// LECTURES

// const currencies = new Map([
//     ['USD', 'United States dollar'],
//     ['EUR', 'Euro'],
//     ['GBP', 'Pound sterling'],
// ]);

//const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

/////////////////////////////////////////////////
// let arr = ['a', 'b', 'c', 'd', 'e'];

// console.log(arr.slice(2));
// console.log(arr.slice(2, 4));
// console.log(arr.slice(-2));
// console.log(arr.slice(-1));
// console.log(arr.slice(1, -2));
// console.log(arr.slice());

// // SPLICE
// console.log(arr.splice(2));
// console.log(arr);

// // REVERSE
// arr = ['a', 'b', 'c', 'd', 'e'];
// const arr2 = ['j', 'i', 'h', 'g', 'f'];
// console.log(arr2.reverse());
// console.log(arr2);

// // CONCAT
// const letters = arr.concat(arr2);
// console.log(letters);

// // JOIN
// console.log(letters.join('-'));

// const arr = [23, 11, 64];
// console.log(arr[1]);
// console.log(arr.at(1));

// console.log(arr.at(-1));

// for (const [i, move] of movements.entries()) {
//     if (move > 0) {
//         console.log(`Movement ${i + 1}: You deposited ${move}`);
//     } else {
//         console.log(`Movement ${i + 1}: You withdraw ${Math.abs(move)}`);
//     }
// }

// console.log('------FOREACH------');
// movements.forEach(function(movement, i) {
//     if (movement > 0) {
//         console.log(`Movement ${i + 1}: You deposited ${movement}`);
//     } else {
//         console.log(`Movement ${i + 1}: You withdraw ${Math.abs(movement)}`);
//     }
// });
// // 0: function(200)
// // 1: function(450)
// // 2: function(400)
// // ...

// Map
// const currencies = new Map([
//     ['USD', 'United States dollar'],
//     ['EUR', 'Euro'],
//     ['GBP', 'Pound sterling'],
// ]);

// currencies.forEach(function(value, key, map) {
//     console.log(`${key}: ${value}`);
// });

// // Set
// const currenciesUnique = new Set(['USD', 'GBP', 'USD', 'EUR', 'EUR']);
// console.log(currenciesUnique);

// currenciesUnique.forEach(function(value) {
//     console.log(`${value}`);
// });

// Coding challenge #1
// const checkDogs = function(dogsJulia, dogsKate) {
//     const dogsJuliaCorrected = dogsJulia.slice(1, -2);

//     const dogsAge = [...dogsJuliaCorrected, ...dogsKate];

//     dogsAge.forEach(function(age, i) {
//         if (age >= 3) {
//             console.log(`Dog number ${i + 1} is an adult, and is ${age} years old`);
//         } else {
//             console.log(`Dog number ${i + 1} is still a puppy`);
//         }
//     });
// };

// const dogsJulia = [3, 5, 2, 12, 7];
// const dogsKate = [4, 1, 15, 8, 3];
// //checkDogs(dogsJulia, dogsKate);
// checkDogs([9, 16, 6, 8, 3], [10, 5, 6, 1, 4]);

// const eurToUsd = 1.1;

// const movementsUsd = movements.map(move => move * eurToUsd);
// console.log(movements);
// console.log(movementsUsd);

// const movementsUSD = [];
// for (const mov of movements) {
//     movementsUSD.push(mov * 1.1);
// }
// console.log(movementsUSD);

// const movDescription = movements.map(
//     (move, i) =>
//     `Movement ${i + 1}: You ${move > 0 ? 'deposited' : 'withdraw'} ${Math.abs(
//       move
//     )}`
// );
// console.log(movDescription);

//filter
// const deposits = movements.filter(mov => mov > 0);
// console.log(deposits);

// const withdrawals = movements.filter(mov => mov < 0);
// console.log(withdrawals);

// Reduce
// console.log(movements);

// // accumulator -> SNOWBALL
// const balance = movements.reduce(function(acc, cur, i, arr) {
//     console.log(`Iteration ${i}: ${acc}`);
//     return acc + cur;
// }, 0);

// console.log(balance);

// Maximum value
// const max = movements.reduce(
//     (acc, mov) => (acc > mov ? acc : mov),
//     movements[0]
// );

// console.log(max);

// Coding challenge #1
const calcAverageHumanAge = function(ages) {
    const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
    console.log(humanAges);

    const adultDogsHumanAge = humanAges.filter(age => age >= 18);
    console.log(adultDogsHumanAge);

    const avg =
        adultDogsHumanAge.reduce((acc, age) => acc + age, 0) /
        adultDogsHumanAge.length;

    return avg;
};

console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
console.log(`--------------------------------------------`);
console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));