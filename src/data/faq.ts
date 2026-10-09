import { HORARIO_ENVIOS, ZONAS_ENVIO } from '../config'
import { MAYORISTA_DESDE } from './pricing'

export interface FaqItem {
  pregunta: string
  respuesta: string
}

export const FAQ: FaqItem[] = [
  {
    pregunta: '¿Cómo compro?',
    respuesta:
      'Elegí los sabores y las cantidades, agregalos al carrito y completá tus datos. Al confirmar se abre WhatsApp con tu pedido armado, solo tenés que enviarlo.',
  },
  {
    pregunta: '¿Qué medios de pago aceptan?',
    respuesta:
      'Efectivo al recibir el pedido o transferencia. Si elegís transferencia, mandanos el comprobante por WhatsApp para confirmar.',
  },
  {
    pregunta: '¿A qué zonas envían?',
    respuesta: `Enviamos a ${ZONAS_ENVIO.join(', ')}. Si tu zona no está, escribinos y vemos qué se puede hacer.`,
  },
  {
    pregunta: '¿Cuánto tarda el envío?',
    respuesta: `Los envíos se hacen de ${HORARIO_ENVIOS.desde} a ${HORARIO_ENVIOS.hasta} hs. Una vez confirmado el pedido te avisamos el horario estimado por WhatsApp.`,
  },
  {
    pregunta: '¿Hacen pedidos mayoristas?',
    respuesta: `Sí. A partir de ${MAYORISTA_DESDE} unidades no se compra online: escribinos por WhatsApp y te pasamos precio especial.`,
  },
  {
    pregunta: '¿Tengo que ser mayor de edad?',
    respuesta: 'Sí. La venta es exclusiva para mayores de 18 años.',
  },
]
