import {
  helpers,
  required as vRequired,
  maxLength as vMaxLength,
  minLength as vMinLength
} from '@vuelidate/validators'
import { i18n } from 'boot/i18n'

// not using https://vuelidate-next.netlify.app/advanced_usage.html#i18n-support
// because it doesn't work well with pluralization
const { t } = i18n.global

export { helpers }
// https://vuelidate-next.netlify.app/custom_validators.html#custom-error-messages
export const required = helpers.withMessage(t('validations.required'), vRequired)
export const maxLength = (max) => helpers.withMessage(t('validations.maxLength', max), vMaxLength(max))
export const minLength = (min) => helpers.withMessage(t('validations.minLength', min), vMinLength(min))
