export const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export const phoneRegex = /^\d+$/

export const charactersRegex = /^[a-zA-Z]+$/

// == Password ==
// regex check at least 1 uppercase
export const uppercaseRegex = /^(?=.*[A-Z]).+$/

// regex check at least 1 lowercase
export const lowercaseRegex = /^(?=.*[a-z]).+$/

// regex check at least 1 number
export const numberRegex = /^(?=.*[0-9]).+$/

// regex check contain space
export const spaceRegex = /\s/
