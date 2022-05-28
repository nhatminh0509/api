const mongoError = (err) => {
  switch (err?.code) {
    case 11000:
      return `Duplicate field unique: ${Object.keys(err?.keyPattern)?.[0]}`
    default:
      console.log(err)
      return `${err?.toString()}` 
  }

}

export default mongoError