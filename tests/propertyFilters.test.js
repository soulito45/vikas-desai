import test from 'node:test'
import assert from 'node:assert/strict'
import { filterProperties } from '../src/utils/propertyFilters.js'

const properties = [
  {
    id: 'a',
    title: '2 BHK Apartment',
    location: 'Mira Road East',
    configuration: '2 BHK',
    type: 'Residential',
    status: 'Ready to Move',
    price: '₹78 Lakhs',
  },
  {
    id: 'b',
    title: 'Commercial Office',
    location: 'Mira Road West',
    configuration: 'Office Space',
    type: 'Commercial',
    status: 'Available',
    price: '₹1.15 Cr',
  },
]

test('filters by location, type, configuration, status, and budget', () => {
  const result = filterProperties(properties, {
    location: 'Mira Road East',
    type: 'Residential',
    configuration: '2 BHK',
    status: 'Ready to Move',
    budget: '₹1Cr',
  })

  assert.deepEqual(result.map((property) => property.id), ['a'])
})

test('returns all properties when filters are empty', () => {
  assert.equal(filterProperties(properties, {}).length, 2)
})
