const Joi = require("joi");

// Bandeiras permitidas conforme RN0025
const ALLOWED_BRANDS = ["Visa", "MasterCard", "Amex", "Elo", "Hipercard"];

// Tipos de residência permitidos
const RESIDENCE_TYPES = [
  "Casa",
  "Apartamento",
  "Kitnet",
  "Sobrado",
  "Cobertura",
  "Studio",
];

// Tipos de logradouro
const STREET_TYPES = [
  "Rua",
  "Avenida",
  "Travessa",
  "Alameda",
  "Praça",
  "Estrada",
  "Rodovia",
];

// Estados brasileiros
const BR_STATES = [
  "AC",
  "AL",
  "AP",
  "AM",
  "BA",
  "CE",
  "DF",
  "ES",
  "GO",
  "MA",
  "MT",
  "MS",
  "MG",
  "PA",
  "PB",
  "PR",
  "PE",
  "PI",
  "RJ",
  "RN",
  "RS",
  "RO",
  "RR",
  "SC",
  "SP",
  "SE",
  "TO",
];

const phoneSchema = Joi.object({
  type: Joi.string().valid("mobile", "home", "work").required(),
  ddd: Joi.string()
    .pattern(/^\d{2}$/)
    .required()
    .messages({
      "string.pattern.base": "DDD deve conter exatamente 2 dígitos",
    }),
  number: Joi.string()
    .pattern(/^\d{8,9}$/)
    .required()
    .messages({
      "string.pattern.base": "Número deve conter 8 ou 9 dígitos",
    }),
});

const clientSchema = Joi.object({
  gender: Joi.string()
    .valid("Masculino", "Feminino", "Outro")
    .required()
    .messages({
      "any.only": "Gênero deve ser Masculino, Feminino ou Outro",
    }),
  name: Joi.string()
    .min(2)
    .max(100)
    .pattern(/^[a-zA-ZÀ-ÿ\s]+$/)
    .required()
    .messages({
      "string.min": "Nome deve ter pelo menos 2 caracteres",
      "string.max": "Nome deve ter no máximo 100 caracteres",
      "string.pattern.base": "Nome deve conter apenas letras e espaços",
    }),
  birthDate: Joi.date().max("now").min("1900-01-01").required().messages({
    "date.max": "Data de nascimento não pode ser futura",
    "date.min": "Data de nascimento inválida",
  }),
  cpf: Joi.string()
    .pattern(/^\d{11}$/)
    .required()
    .custom((value, helpers) => {
      // Validação básica de CPF
      if (value.split("").every((digit) => digit === value[0])) {
        return helpers.error("any.invalid");
      }
      return value;
    })
    .messages({
      "string.pattern.base": "CPF deve conter exatamente 11 dígitos",
      "any.invalid": "CPF inválido",
    }),
  email: Joi.string()
    .email({ tlds: { allow: false } })
    .max(100)
    .required()
    .messages({
      "string.email": "E-mail deve ter formato válido",
      "string.max": "E-mail deve ter no máximo 100 caracteres",
    }),
  phone: phoneSchema.required(),
  password: Joi.string()
    .min(8)
    .max(50)
    .pattern(new RegExp("(?=.*[a-z])"))
    .pattern(new RegExp("(?=.*[A-Z])"))
    .pattern(new RegExp("(?=.*[0-9])"))
    .pattern(new RegExp("(?=.*[!@#\\$%\\^&\\*])"))
    .required()
    .messages({
      "string.min": "Senha deve ter pelo menos 8 caracteres",
      "string.max": "Senha deve ter no máximo 50 caracteres",
      "string.pattern.base":
        "Senha deve conter ao menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial",
    }),
  passwordConfirm: Joi.any().valid(Joi.ref("password")).required().messages({
    "any.only": "Confirmação de senha deve ser igual à senha",
  }),
  ranking: Joi.number().integer().min(0).max(100).default(0),
  addresses: Joi.array()
    .items(
      Joi.object({
        name: Joi.string().max(50).optional(),
        residenceType: Joi.string()
          .valid(...RESIDENCE_TYPES)
          .required()
          .messages({
            "any.only": `Tipo de residência deve ser: ${RESIDENCE_TYPES.join(
              ", "
            )}`,
          }),
        streetType: Joi.string()
          .valid(...STREET_TYPES)
          .required()
          .messages({
            "any.only": `Tipo de logradouro deve ser: ${STREET_TYPES.join(
              ", "
            )}`,
          }),
        street: Joi.string().min(5).max(100).required(),
        number: Joi.string().max(10).required(),
        district: Joi.string().min(2).max(50).required(),
        cep: Joi.string()
          .pattern(/^\d{5}-?\d{3}$/)
          .required()
          .messages({
            "string.pattern.base": "CEP deve ter formato 12345-678 ou 12345678",
          }),
        city: Joi.string().min(2).max(50).required(),
        state: Joi.string()
          .valid(...BR_STATES)
          .required()
          .messages({
            "any.only": "Estado deve ser uma sigla válida (ex: SP, RJ, MG)",
          }),
        country: Joi.string().max(50).default("Brasil"),
        observations: Joi.string().max(200).allow(null, ""),
        isBilling: Joi.boolean().default(false),
        isDelivery: Joi.boolean().default(false),
      })
    )
    .min(0) // MUDANÇA: permitir 0 endereços
    .optional(),
  cards: Joi.array()
    .items(
      Joi.object({
        cardNumber: Joi.string().creditCard().required().messages({
          "string.creditCard": "Número do cartão inválido",
        }),
        cardName: Joi.string()
          .min(2)
          .max(50)
          .pattern(/^[a-zA-ZÀ-ÿ\s]+$/)
          .required()
          .messages({
            "string.pattern.base":
              "Nome no cartão deve conter apenas letras e espaços",
          }),
        brand: Joi.string()
          .valid(...ALLOWED_BRANDS)
          .required()
          .messages({
            "any.only": `Bandeira deve ser uma das permitidas: ${ALLOWED_BRANDS.join(
              ", "
            )}`,
          }),
        securityCode: Joi.string()
          .pattern(/^\d{3,4}$/)
          .required()
          .messages({
            "string.pattern.base":
              "Código de segurança deve ter 3 ou 4 dígitos",
          }),
        isPreferred: Joi.boolean().default(false),
      })
    )
    .min(0) // MUDANÇA: permitir 0 cartões
    .optional(),
}).options({ allowUnknown: false });

const passwordSchema = Joi.object({
  oldPassword: Joi.string().required(),
  newPassword: Joi.string()
    .min(8)
    .max(50)
    .pattern(new RegExp("(?=.*[a-z])"))
    .pattern(new RegExp("(?=.*[A-Z])"))
    .pattern(new RegExp("(?=.*[0-9])"))
    .pattern(new RegExp("(?=.*[!@#\\$%\\^&\\*])"))
    .required()
    .messages({
      "string.min": "Nova senha deve ter pelo menos 8 caracteres",
      "string.pattern.base":
        "Nova senha deve conter ao menos: 1 letra minúscula, 1 maiúscula, 1 número e 1 caractere especial",
    }),
  newPasswordConfirm: Joi.any()
    .valid(Joi.ref("newPassword"))
    .required()
    .messages({
      "any.only": "Confirmação da nova senha deve ser igual à nova senha",
    }),
});

const addressSchema = Joi.object({
  name: Joi.string().max(50).optional(),
  residenceType: Joi.string()
    .valid(...RESIDENCE_TYPES)
    .required(),
  streetType: Joi.string()
    .valid(...STREET_TYPES)
    .required(),
  street: Joi.string().min(5).max(100).required(),
  number: Joi.string().max(10).required(),
  district: Joi.string().min(2).max(50).required(),
  cep: Joi.string()
    .pattern(/^\d{5}-?\d{3}$/)
    .required(),
  city: Joi.string().min(2).max(50).required(),
  state: Joi.string()
    .valid(...BR_STATES)
    .required(),
  country: Joi.string().max(50).default("Brasil"),
  observations: Joi.string().max(200).allow(null, ""),
  isBilling: Joi.boolean().default(false),
  isDelivery: Joi.boolean().default(false),
});

const cardSchema = Joi.object({
  cardNumber: Joi.string().creditCard().required(),
  cardName: Joi.string()
    .min(2)
    .max(50)
    .pattern(/^[a-zA-ZÀ-ÿ\s]+$/)
    .required(),
  brand: Joi.string()
    .valid(...ALLOWED_BRANDS)
    .required(),
  securityCode: Joi.string()
    .pattern(/^\d{3,4}$/)
    .required(),
  isPreferred: Joi.boolean().default(false),
});

// Schema para filtros de busca
const clientFiltersSchema = Joi.object({
  name: Joi.string().max(100).optional(),
  cpf: Joi.string()
    .pattern(/^\d{11}$/)
    .optional(),
  email: Joi.string().email().optional(),
  clientCode: Joi.string().max(20).optional(),
  active: Joi.string().valid("true", "false").optional(),
  page: Joi.number().integer().min(1).default(1),
  limit: Joi.number().integer().min(1).max(100).default(50),
});

module.exports = {
  clientSchema,
  passwordSchema,
  addressSchema,
  cardSchema,
  clientFiltersSchema,
  ALLOWED_BRANDS,
  RESIDENCE_TYPES,
  STREET_TYPES,
  BR_STATES,
};
