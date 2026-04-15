const query = `
query GetProduct {
  product(handle: "balmain-black-leather-shoulder-bag") {
    title
    handle
  }
}
`;

console.log(query);