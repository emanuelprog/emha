<template>
  <q-page class="q-pa-none" :class="$q.dark.isActive ? 'bg-grey-10' : 'bg-white'">
    <div class="q-pb-md column items-center">
      <div ref="homeRef" class="q-mb-md" style="width: 220px; max-width: 90vw; height: auto;" />

      <div class="text-center" style="max-width: 900px;">
        <div class="text-h5 text-bold q-mb-sm" :class="$q.dark.isActive ? 'text-white' : 'text-dark'">
          Bem-vindo(a) ao cadastro EMHA
        </div>

        <div class="text-body1 q-mx-auto q-mb-sm" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-8'"
          style="line-height: 1.6;">
          Confira aqui informações para receber benefício de habitação de interesse social junto ao Município de Campo
          Grande ou aquisição de direitos sobre os imóveis da carteira imobiliária da Agência Municipal de Habitação e
          Assuntos Fundiários.
        </div>

        <hr class="q-my-md" style="width: 60px; border: 1px solid #ccc;" />

        <div class="text-caption" :class="$q.dark.isActive ? 'text-grey-5' : 'text-grey-6'">
          Contato para dúvidas: <b>(67) 3314-3900 / (67) 3314-3935</b><br />
          <small>(Segunda a Sexta 08:00 Às 11:00 e 13:00 Às 17:00)</small>
        </div>
      </div>
    </div>

    <div v-if="events.length > 0" class="q-pt-sm full-width">
      <div class="text-h4 text-center text-bold q-mb-md" :class="$q.dark.isActive ? 'text-white' : 'text-primary'">
        Eventos
      </div>
      <q-carousel v-model="slide" transition-prev="slide-right" transition-next="slide-left" arrows navigation
        control-color="white" max-height="400px" class="bg-primary text-white">
        <q-carousel-slide v-for="event in events" :key="event.id" :name="event.id"
          class="column items-center justify-center q-px-xl">
          <q-card flat bordered
            :class="$q.dark.isActive ? 'bg-white text-white shadow-2' : 'bg-white text-dark shadow-2'"
            style="max-width: 600px; width: 100%;">
            <q-card-section>
              <div class="text-h6 text-weight-bold">
                {{ event.description }}
              </div>
              <div class="text-caption text-grey-7 q-mt-xs">
                {{ formatDate(event.startDate) }} até {{ formatDate(event.endDate) }}
              </div>
              <div class="text-caption text-grey q-mt-sm">
                <q-icon name="place" /> {{ event.location }}<br />
                <q-icon v-if="formatTime(event.eventDateTime)" name="access_time" size="16px" />
                {{ formatTime(event.eventDateTime) }}
              </div>
              <div class="q-mt-sm" v-if="event.nisRequired">
                <q-badge color="orange" label="Necessário NIS" />
              </div>
            </q-card-section>

            <q-separator />

            <q-card-actions align="right">
              <q-btn color="primary" label="Inscrever-se" @click="goToInscription(event)" />
            </q-card-actions>
          </q-card>
        </q-carousel-slide>
      </q-carousel>
    </div>

    <div class="row full-width" style="min-height: 360px">
      <div v-for="(item, index) in cards" :key="index" class="col-12 col-sm-6 flex flex-center"
        :class="[item.bg, item.text]">
        <div class="column items-center justify-center q-my-lg" style="width: 100%">
          <div :ref="el => animationRefs[index] = el as HTMLElement" style="width: 200px; height: 200px;"
            class="q-mb-md" />
          <div class="text-h5 text-center q-mb-sm">{{ item.title }}</div>
          <div class="text-body1 text-center q-mb-md">{{ item.description }}</div>
          <q-btn label="Clique aqui" :color="item.buttonColor" :text-color="item.buttonText" class="q-mt-md hover-scale"
            style="min-width: 150px; font-weight: bold; padding: 10px 24px;" rounded @click="goToRoute(item.route)" />
        </div>
      </div>
    </div>

    <div class="row items-center justify-center q-mt-xl q-pa-md">
      <div class="col-12 col-md-7">
        <div class="text-h6 text-bold q-mb-md" :class="$q.dark.isActive ? 'text-white' : 'text-grey-9'">
          Informações Importantes
        </div>

        <div class="text-body1" :class="$q.dark.isActive ? 'text-grey-4' : 'text-grey-8'" style="line-height: 1.8;">
          O cadastramento para receber benefício de habitação de interesse social junto ao Município de Campo Grande ou
          aquisição de direitos sobre os imóveis da carteira imobiliária da
          <b>AGÊNCIA MUNICIPAL DE HABITAÇÃO E ASSUNTOS FUNDIÁRIOS</b> por meio de quaisquer das modalidades de benefício
          previstas, está <b>VEDADA</b> aos interessados que:
          <br><br>
          <ul style="padding-left: 1rem; list-style: none;">
            <li>I — não sejam brasileiros natos ou naturalizados;</li>
            <li>II — sejam proprietários de imóveis ou já tenham recebido benefício ou subsídios de políticas de
              habitação de interesse social em qualquer parte do território nacional;</li>
            <li>III — figurem ou tenham figurado como beneficiários dos programas habitacionais da <b>AGÊNCIA MUNICIPAL
                DE HABITAÇÃO E ASSUNTOS FUNDIÁRIOS</b>, da Agência Estadual de Habitação Popular do Estado de Mato
              Grosso do Sul — <b>AGEHAB</b> ou de outros agentes promotores de programas habitacionais de interesse
              social;</li>
            <li>IV — figurem como beneficiários de imóvel de interesse social no Cadastro Nacional de Mutuários –
              <b>CADMUT</b>;
            </li>
            <li>V — tenham renda familiar superior a 3 (três) vezes o salário mínimo vigente no país;</li>
            <li>VI — não cumpram com as exigências previstas na Política Municipal de Habitação de Interesse Social —
              <b>POLHIS</b>.
            </li>
          </ul>
        </div>
      </div>

      <div class="col-12 col-md-4 flex flex-center q-mt-lg q-mt-md-none">
        <div ref="infoRef" style="width: 200px; height: 200px;" />
      </div>
    </div>
  </q-page>
</template>


<script setup lang="ts">
import { onMounted, ref } from 'vue'
import { useHomePage } from './HomePage'
import lottie from 'lottie-web'

const homeRef = ref<HTMLElement | null>(null)
const infoRef = ref<HTMLElement | null>(null)
const animationRefs = ref<(HTMLElement | null)[]>([])
const { cards, events, slide, formatDate, formatTime, loadEvents, goToInscription, goToRoute } = useHomePage()

onMounted(() => {
  if (homeRef.value) {
    lottie.loadAnimation({
      container: homeRef.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/animations/home.json'
    })
  }

  cards.forEach((card, index) => {
    const el = animationRefs.value[index]
    if (el) {
      lottie.loadAnimation({
        container: el,
        renderer: 'svg',
        loop: true,
        autoplay: true,
        path: card.animationPath
      })
    }
  })

  if (infoRef.value) {
    lottie.loadAnimation({
      container: infoRef.value,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: '/animations/info.json'
    })
  }

  void loadEvents()
})
</script>
