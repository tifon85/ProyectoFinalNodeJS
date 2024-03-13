export const generateUserErrorInfo = (user) => {
    return `
      Una o mas de las siguientes propiedades es incorrecta:
      * title: Debe ser tipo String, se recibio: ${user.title}
      * description: Debe ser tipo String, se recibio: ${user.description}
      * price: Debe ser tipo Number, se recibio: ${user.price}
      * category: Debe ser tipo String, se recibio: ${user.category}
      * code: Debe ser tipo String, se recibio: ${user.code}
      * stock: Debe ser tipo Number, se recibio: ${user.stock}
    `
  }

export default generateUserErrorInfo