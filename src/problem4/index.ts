// 1. using loop cost O(n) complexity since it loop every single number
function sum_to_n_a(input: number): number {
  let result = 0;
  for (let i = input; i >= 1; i--) {
    if (Number.isInteger(i)) result = result + i;
  }
  return result;
}

// 2. use formula, this cost only O(1) and best effective
function sum_to_n_b(n: number): number {
  return (n * (n + 1)) / 2;
}

// 3. Use recurrence this way cost O(log n) because it reduce the input by half each run
function sum_to_n_c(n: number): number {
  if (n <= 1) {
    return n;
  }

  if (n % 2 !== 0) {
    return sum_to_n_c(n - 1) + n;
  }

  const half = n / 2;
  return 2 * sum_to_n_c(half) + half * half;
}
