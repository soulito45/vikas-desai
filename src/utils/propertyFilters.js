function numericPrice(value) {
  const text = String(value || '').toLowerCase()
  const number = Number(text.match(/\d+(?:\.\d+)?/)?.[0] || 0)
  if (text.includes('cr')) return number * 100
  if (text.includes('lakhs')) return number * 1
  return number
}

function matchesBudget(propertyPrice, budget) {
  if (!budget) return true
  const price = numericPrice(propertyPrice)
  const requested = numericPrice(budget.replace('₹', ''))
  return price <= requested
}

export function filterProperties(properties, filters = {}) {
  const normalized = Object.fromEntries(
    Object.entries(filters).map(([key, value]) => [key, String(value || '').trim().toLowerCase()]),
  )

  return properties.filter((property) => {
    const searchable = [
      property.title,
      property.location,
      property.configuration,
      property.type,
      property.status,
    ].join(' ').toLowerCase()

    const matchesLocation = !normalized.location || searchable.includes(normalized.location)
    const matchesType = !normalized.type || searchable.includes(normalized.type)
    const matchesConfiguration = !normalized.configuration || searchable.includes(normalized.configuration)
    const matchesStatus = !normalized.status || searchable.includes(normalized.status)
    const matchesBudgetValue = matchesBudget(property.price, normalized.budget)
    return matchesLocation && matchesType && matchesConfiguration && matchesStatus && matchesBudgetValue
  })
}
