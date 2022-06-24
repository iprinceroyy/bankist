'use strict';

/////////////////////////////////////////////////
/////////////////////////////////////////////////
// BANKIST APP
const movements = [200, 450, -400, 3000, -650, -130, 70, 1300];

// Data
const account1 = {
    owner: 'Jonas Schmedtmann',
    movements: [200, 455.23, -306.5, 25000, -642.21, -133.9, 79.97, 1300],
    interestRate: 1.2, // %
    pin: 1111,

    movementsDates: [
        '2019-11-18T21:31:17.178Z',
        '2019-12-23T07:42:02.383Z',
        '2020-01-28T09:15:04.904Z',
        '2020-04-01T10:17:24.185Z',
        '2020-05-08T14:11:59.604Z',
        '2022-06-25T17:01:17.194Z',
        '2022-06-24T23:36:17.929Z',
        '2022-06-23T10:51:36.790Z',
    ],
    currency: 'EUR',
    locale: 'pt-PT', // de-DE
};

const account2 = {
    owner: 'Jessica Davis',
    movements: [5000, 3400, -150, -790, -3210, -1000, 8500, -30],
    interestRate: 1.5,
    pin: 2222,

    movementsDates: [
        '2019-11-01T13:15:33.035Z',
        '2019-11-30T09:48:16.867Z',
        '2019-12-25T06:04:23.907Z',
        '2020-01-25T14:18:46.235Z',
        '2020-02-05T16:33:06.386Z',
        '2020-06-25T14:43:26.374Z',
        '2020-06-24T18:49:59.371Z',
        '2022-06-23T12:01:20.894Z',
    ],
    currency: 'USD',
    locale: 'en-US',
};

const accounts = [account1, account2];

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

/////////////////////////////////////
// Functions

const formatMovementDate = function(date, locale) {
    const calcDaysPassed = (date1, date2) =>
        Math.round(Math.abs(date1 - date2) / (1000 * 60 * 60 * 24));

    const daysPassed = calcDaysPassed(new Date(), date);
    console.log(daysPassed);

    if (daysPassed === 0) return 'Today';
    if (daysPassed === 1) return 'Yesterday';
    if (daysPassed <= 7) return `${daysPassed} days ago`;

    return new Intl.DateTimeFormat(locale).format(date);
};

const formatCurrency = function(value, locale, currency) {
    return new Intl.NumberFormat(locale, {
        style: 'currency',
        currency: currency,
    }).format(value);
};

const displayMovements = function(acc, sort = false) {
    containerMovements.innerHTML = ''; //to clear data displayed previously

    const movs = sort ?
        acc.movements.slice().sort((a, b) => a - b) :
        acc.movements;

    movs.forEach(function(move, i) {
        const type = move > 0 ? 'deposit' : 'withdrawal';

        const date = new Date(acc.movementsDates[i]);
        const displayDate = formatMovementDate(date, acc.locale);

        const displayBalance = formatCurrency(move, acc.locale, acc.currency);

        const html = `
        <div class="movements__row">
            <div class="movements__type movements__type--${type}">${
      i + 1
    } ${type}</div>
    <div class="movements__date">${displayDate}</div>
            <div class="movements__value">${displayBalance}</div>
        </div>`;

        containerMovements.insertAdjacentHTML('afterbegin', html);
    });
};

const calcDisplayBalance = function(acc) {
    acc.balance = acc.movements.reduce((acc, curr) => acc + curr, 0);
    const formattedMov = formatCurrency(acc.balance, acc.locale, acc.currency);
    labelBalance.textContent = formattedMov;
};

const calcDisplaySummary = function(accs) {
    const incomes = accs.movements
        .filter(mov => mov > 0)
        .reduce((acc, mov) => acc + mov, 0);

    labelSumIn.textContent = formatCurrency(incomes, accs.locale, accs.currency);

    const out = accs.movements
        .filter(mov => mov < 0)
        .reduce((acc, mov) => acc + mov, 0);

    labelSumOut.textContent = formatCurrency(
        Math.abs(out),
        accs.locale,
        accs.currency
    );

    const interest = accs.movements
        .filter(mov => mov > 0)
        .map(deposit => (deposit * accs.interestRate) / 100)
        .filter(int => int >= 1)
        .reduce((acc, int) => acc + int, 0);

    labelSumInterest.textContent = formatCurrency(
        interest,
        accs.locale,
        accs.currency
    );
};

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

const updateUI = function(acc) {
    //Display movements
    displayMovements(acc);

    // Display balance
    calcDisplayBalance(acc);

    // Display summary
    calcDisplaySummary(acc);
};

// Login
let currentAccount;
btnLogin.addEventListener('click', function(e) {
    // prevent form from submitting
    e.preventDefault();
    currentAccount = accounts.find(
        acc => acc.username === inputLoginUsername.value
    );
    console.log(currentAccount);
    if (currentAccount && currentAccount.pin === Number(inputLoginPin.value)) {
        // Dsiplay UI and a welcome msg
        labelWelcome.textContent = `Welcome back, ${
      currentAccount.owner.split(' ')[0]
    }`;
        containerApp.style.opacity = 1;

        // Create current date and time
        const now = new Date();
        const options = {
            hour: 'numeric',
            minute: 'numeric',
            day: 'numeric',
            month: 'numeric',
            year: 'numeric',
        };
        //const locale = navigator.language;
        labelDate.textContent = new Intl.DateTimeFormat(
            currentAccount.locale,
            options
        ).format(now);

        // Clear input fields
        inputLoginUsername.value = inputLoginPin.value = '';
        inputLoginPin.blur();

        // Update UI
        updateUI(currentAccount);
    }
});

// Transfer
btnTransfer.addEventListener('click', function(e) {
    e.preventDefault();

    const amount = Number(inputTransferAmount.value);
    const recieverAcc = accounts.find(
        acc => acc.username === inputTransferTo.value
    );
    inputTransferAmount.value = inputTransferTo.value = '';
    if (
        amount > 0 &&
        recieverAcc &&
        currentAccount.balance >= amount &&
        recieverAcc.username !== currentAccount.username
    ) {
        // Doing transfer
        currentAccount.movements.push(-amount);
        recieverAcc.movements.push(amount);

        // Add transfer date
        currentAccount.movementsDates.push(new Date().toISOString());
        recieverAcc.movementsDates.push(new Date().toISOString());

        // Update UI
        updateUI(currentAccount);
    }
});

// Request a loan
btnLoan.addEventListener('click', function(e) {
    e.preventDefault();

    const amount = Math.floor(inputLoanAmount.value);

    if (amount > 0 && currentAccount.movements.some(mov => mov >= amount / 10)) {
        // Add movement
        currentAccount.movements.push(amount);

        // Add loan date
        currentAccount.movementsDates.push(new Date().toISOString());

        //update UI
        updateUI(currentAccount);
    }
    inputLoanAmount.value = '';
});

// Close account
btnClose.addEventListener('click', function(e) {
    e.preventDefault();

    if (
        inputCloseUsername.value == currentAccount.username &&
        Number(inputClosePin.value) == currentAccount.pin
    ) {
        const index = accounts.findIndex(
            acc => acc.username === currentAccount.username
        );
        console.log(index);

        // Delete account
        accounts.splice(index, 1);

        // Hide UI
        containerApp.style.opacity = 0;
    }

    inputCloseUsername.value = inputClosePin.value = '';
});

let sorted = false;
btnSort.addEventListener('click', function(e) {
    e.preventDefault();
    displayMovements(currentAccount, !sorted);
    sorted = !sorted;
});

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
// const calcAverageHumanAge = function(ages) {
//     const humanAges = ages.map(age => (age <= 2 ? 2 * age : 16 + age * 4));
//     console.log(humanAges);

//     const adultDogsHumanAge = humanAges.filter(age => age >= 18);
//     console.log(adultDogsHumanAge);

//     const avg =
//         adultDogsHumanAge.reduce((acc, age) => acc + age, 0) /
//         adultDogsHumanAge.length;

//     return avg;
// };

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(`--------------------------------------------`);
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

// Coding challenge #3
// const calcAverageHumanAge = ages => {
//     const avg = ages
//         .map(age => (age <= 2 ? 2 * age : 16 + age * 4))
//         .filter(age => age >= 18)
//         .reduce((acc, age, i, arr) => acc + age / arr.length, 0);

//     return avg;
// };

// console.log(calcAverageHumanAge([5, 2, 4, 1, 15, 8, 3]));
// console.log(`--------------------------------------------`);
// console.log(calcAverageHumanAge([16, 6, 10, 5, 6, 1, 4]));

// const firstWithdrawal = movements.find(mov => mov < 0);
// console.log(firstWithdrawal);

// const account = accounts.find(acc => acc.owner === 'Jessica Davis');
// console.log(account);

// console.log(movements);

// Equality
// console.log(movements.includes(-130));

// // Some: Condition
// const anyDeposits = movements.some(mov => mov > 1500);
// console.log(anyDeposits);

// // Every: Condition
// console.log(movements.every(mov => mov > 0));
// console.log(account4.movements.every(mov => mov > 0));

// // Separate callbacks
// const deposit = mov => mov > 0;
// console.log(movements.some(deposit));
// console.log(movements.every(deposit));
// console.log(movements.filter(deposit));

// const arr = [
//     [1, 2, 3],
//     [4, 5, 6], 7, 8
// ];
// console.log(arr.flat());

// const arrDeep = [
//     [1, 2, 3],
//     [4, [5, 6]], 7, 8
// ];
// console.log(arrDeep.flat(2));

// // flat
// const overallBalance = accounts
//     .map(acc => acc.movements)
//     .flat()
//     .reduce((acc, mov) => acc + mov, 0);

// console.log(overallBalance);

// // flatMap
// const overallBalance2 = accounts
//     .flatMap(acc => acc.movements)
//     .reduce((acc, mov) => acc + mov, 0);
// console.log(overallBalance2);

// Strings
// const owner = ['Jonas', 'Zach', 'Adam', 'Martha'];
// console.log(owner.sort());

// // Numbers
// console.log(movements);

// // return < 0, A, B (keep order)
// // return > 0, B, A (switch order)

// // Ascending
// // movements.sort((a, b) => {
// //     return a > b ? 1 : -1;
// // });
// // Alter
// movements.sort((a, b) => a - b);
// console.log(movements);

// console.log([1, 2, 3, 4, 5, 6, 7]);
// console.log(new Array(1, 2, 3, 4, 5, 6));

// // Empty arrays + fill method
// const x = new Array(7);
// console.log(x);

// x.fill(2, 3);
// console.log(x);

// // Array.from
// const arr = Array.from({ length: 7 }, () => 1);
// console.log(arr);

// const z = Array.from({ length: 7 }, (_, i) => i + 1);
// console.log(z);

// labelBalance.addEventListener('click', function() {
//     const movementsUI = Array.from(
//         document.querySelectorAll('.movements__value')
//     );

//     console.log(movementsUI.map(el => el.textContent.replace('€', '')));
// });

// 1.
// const bankDepositSum = accounts
//     .flatMap(acc => acc.movements)
//     .filter(mov => mov > 0)
//     .reduce((sum, curr) => sum + curr, 0);

// console.log(bankDepositSum);

// // 2.
// const numDeposits1000 = accounts
//     .flatMap(acc => acc.movements)
//     .reduce((sum, curr) => (curr >= 1000 ? ++sum : sum), 0);

// console.log(numDeposits1000);

// // 3.
// const sums = accounts
//     .flatMap(acc => acc.movements)
//     .reduce(
//         (sum, cur) => {
//             //cur > 0 ? (sum.deposits += cur) : (sum.withdrawls += cur);
//             sum[cur > 0 ? 'deposits' : 'withdrawls'] += cur;
//             return sum;
//         }, { deposits: 0, withdrawls: 0 }
//     );
// console.log(sums);

// // 4.
// const convertToTitleCase = function(title) {
//     const capitalize = str => str[0].toUpperCase() + str.slice(1);

//     const exceptions = [
//         'a',
//         'is',
//         'and',
//         'an',
//         'the',
//         'but',
//         'or',
//         'on',
//         'in',
//         'with',
//     ];

//     const titleCase = title
//         .toLowerCase()
//         .split(' ')
//         .map(word => (exceptions.includes(word) ? word : capitalize(word)))
//         .join(' ');

//     return capitalize(titleCase);
// };

// console.log(convertToTitleCase('priNce roy is Very smart boy'));
// console.log(convertToTitleCase('and here is a good example'));

// Coding challenge 4

// const dogs = [
//     { weight: 22, curFood: 250, owners: ['Alice', 'Bob'] },
//     { weight: 13, curFood: 275, owners: ['Sarah', 'John'] },
//     { weight: 32, curFood: 340, owners: ['Michael'] },
// ];

// // 1
// dogs.forEach(
//     dog => (dog.recommendedFood = Math.trunc(dog.weight ** 0.75 * 28))
// );
// console.log(dogs);

// // 2
// const dogSarah = dogs.find(dog => dog.owners.includes('Sarah'));
// console.log(dogSarah);

// console.log(
//     `Sarah's dog is eating too${
//     dogSarah.curFood > dogSarah.recommendedFood ? 'much' : 'little'
//   }`
// );

// // 3
// const ownersEatTooMuch = dogs
//     .filter(dog => dog.curFood > dog.recommendedFood)
//     .flatMap(dog => dog.owners);
// console.log(ownersEatTooMuch);

// const ownersEatTooLittle = dogs
//     .filter(dog => dog.curFood < dog.recommendedFood)
//     .flatMap(dog => dog.owners);
// console.log(ownersEatTooLittle);

// // 4
// console.log(`${ownersEatTooMuch.join(' and ')}'s dogs eat too much!`);
// console.log(`${ownersEatTooLittle.join(' and ')}'s dogs eat too little!`);

// // 5
// console.log(dogs.some(dog => dog.curFood === dog.recommendedFood));

// // 6
// const checkEatingOkay = dog =>
//     dog.curFood > dog.recommendedFood * 0.9 &&
//     dog.curFood < dog.recommendedFood * 1.1;

// console.log(dogs.some(checkEatingOkay));

// // 7
// console.log(dogs.filter(checkEatingOkay));

// // 8
// const dogsSorted = dogs
//     .slice()
//     .sort((a, b) => a.recommendedFood - b.recommendedFood);
// console.log(dogsSorted);