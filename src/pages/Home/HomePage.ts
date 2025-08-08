import { ref } from 'vue'
import { formatDate, formatTime } from 'src/util/dateUtil'
import { useRouter } from 'vue-router'
import { fetchEvent } from 'src/services/eventService'
import type { EventType } from 'src/types/eventType'
import { useEventStore } from 'src/stores/eventStore'

export function useHomePage() {
  const router = useRouter()

  const cards = [
    {
      title: 'Cadastro',
      description: 'Cadastre-se para receber benefício de habitação',
      route: 'cadastro',
      animationPath: '/animations/register.json',
      bg: 'bg-primary',
      text: 'text-white',
      buttonColor: 'white',
      buttonText: 'indigo-10'
    },
    {
      title: 'Área do Mutuário',
      description: 'Acesse sua Área',
      route: 'area-do-mutuario',
      animationPath: '/animations/borrower.json',
      bg: 'bg-grey-2',
      text: 'text-dark',
      buttonColor: 'primary',
      buttonText: 'white'
    }
  ]

  const events = ref<EventType[]>([])
  const slide = ref<number | null>(null)
  const eventStore = useEventStore();

  async function loadEvents() {
    try {
      const data = await fetchEvent(new Date(), new Date())
      events.value = data

      if (events.value.length > 0 && events.value[0]?.id != null) {
        slide.value = events.value[0].id
      }
    } catch (err) {
      console.error('Erro ao buscar eventos:', err)
    }
  }

  async function goToInscription(event: EventType) {
    await router.push({ path: 'termo-evento' })
    eventStore.setSelectedEvent(event);
  }

  async function goToRoute(route: string) {
    await router.push({ path: route })
  }

  return { cards, events, slide, loadEvents, formatDate, formatTime, goToInscription, goToRoute }
}