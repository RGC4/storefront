<<<<<<< HEAD
export const GET_ALL_COLLECTIONS = `
=======
﻿export const GET_ALL_COLLECTIONS = `
>>>>>>> 2ff45f2b3f7572b535ac984c23adf29d3a61394b
  query GetAllCollections($first: Int!) {
    collections(first: $first) {
      edges {
        node {
          id
          title
          handle
          description
          image {
            url
            altText
            width
            height
          }
        }
      }
    }
  }
`;

export const GET_COLLECTION_BY_HANDLE = `
  query GetCollectionByHandle($handle: String!, $first: Int!) {
    collectionByHandle(handle: $handle) {
      id
      title
      description
      image { url altText width height }
      products(first: $first) {
        edges {
          node {
            id title handle description vendor tags
            priceRange {
              minVariantPrice { amount currencyCode }
              maxVariantPrice { amount currencyCode }
            }
            images(first: 5) {
              edges { node { url altText width height } }
            }
            variants(first: 50) {
              edges {
                node {
                  id title availableForSale
                  price { amount currencyCode }
                  selectedOptions { name value }
                }
              }
            }
            options { id name values }
          }
        }
      }
    }
  }
`;
