document.addEventListener("DOMContentLoaded", () => {
  /* =========================================================
     1. MENU MOBILE E TEMA CLARO / ESCURO
  ========================================================= */
  const menuToggle = document.getElementById("menu-toggle");
  const navMenu = document.getElementById("nav-menu");
  const themeToggle = document.getElementById("theme-toggle");

  menuToggle.addEventListener("click", () => {
    const isOpen = navMenu.classList.toggle("active");
    menuToggle.setAttribute("aria-expanded", isOpen);
  });

  // Fechar menu ao clicar em um link no celular
  document.querySelectorAll(".nav-list a").forEach((link) => {
    link.addEventListener("click", () => {
      navMenu.classList.remove("active");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });

  // Persistência de tema no navegador
  const savedTheme = localStorage.getItem("theme");
  if (savedTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggle.textContent = "☀️";
  }

  themeToggle.addEventListener("click", () => {
    const isDark = document.documentElement.getAttribute("data-theme") === "dark";
    if (isDark) {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
      themeToggle.textContent = "🌙";
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
      themeToggle.textContent = "☀️";
    }
  });

  /* =========================================================
     2. CALCULADORA DA REGRA 60/60 (FONES DE OUVIDO)
  ========================================================= */
  const foneVolumeInput = document.getElementById("fone-volume");
  const foneVolumeVal = document.getElementById("fone-volume-val");
  const foneTempoInput = document.getElementById("fone-tempo");
  const btnAvaliarFone = document.getElementById("btn-avaliar-fone");
  const resultadoFone = document.getElementById("resultado-fone");

  foneVolumeInput.addEventListener("input", () => {
    foneVolumeVal.textContent = `${foneVolumeInput.value}%`;
  });

  btnAvaliarFone.addEventListener("click", () => {
    const volume = Number(foneVolumeInput.value);
    const tempo = Number(foneTempoInput.value);

    if (tempo <= 0 || isNaN(tempo)) {
      resultadoFone.innerHTML = "⚠️ Por favor, informe um tempo válido em minutos.";
      return;
    }

    if (volume <= 60 && tempo <= 60) {
      resultadoFone.style.borderLeftColor = "var(--safe)";
      resultadoFone.innerHTML = `
        <strong>✅ Hábito Seguro!</strong><br>
        Você está seguindo a <strong>Regra 60/60</strong> (${volume}% de volume por ${tempo} min).
        Continue fazendo pausas regulares para descansar os ouvidos.
      `;
    } else if (volume > 80 || tempo > 120) {
      resultadoFone.style.borderLeftColor = "var(--danger)";
      resultadoFone.innerHTML = `
        <strong>🚨 Alto Risco Auditivo!</strong><br>
        Usar fones a <strong>${volume}%</strong> por <strong>${tempo} minutos</strong> seguidos pode causar
        fadiga auditiva, zumbido e perda permanente ao longo do tempo. Reduza o volume para até 60% e faça pausas a cada hora.
      `;
    } else {
      resultadoFone.style.borderLeftColor = "var(--warn)";
      resultadoFone.innerHTML = `
        <strong>⚠️ Atenção Recomendada!</strong><br>
        Você ultrapassou um dos limites da Regra 60/60 (${volume}% de volume / ${tempo} min).
        Tente baixar um pouco o volume ou fazer uma pausa de 15 minutos a cada hora.
      `;
    }
  });

  /* =========================================================
     3. SIMULADOR INTERATIVO DE DECIBÉIS (dB)
  ========================================================= */
  const dbSlider = document.getElementById("db-slider");
  const dbValue = document.getElementById("db-value");
  const dbMeterFill = document.getElementById("db-meter-fill");
  const dbExample = document.getElementById("db-example");
  const dbStatus = document.getElementById("db-status");
  const dbTime = document.getElementById("db-time");
  const dbAdvice = document.getElementById("db-advice");

  const dbData = [
    {
      max: 45,
      example: "Biblioteca silenciosa ou sussurro",
      status: "Seguro",
      tagClass: "safe",
      color: "var(--safe)",
      time: "Sem restrição de tempo",
      advice: "Ambiente tranquilo e totalmente seguro para a saúde auditiva."
    },
    {
      max: 70,
      example: "Conversa em tom normal ou escritório",
      status: "Seguro",
      tagClass: "safe",
      color: "var(--safe)",
      time: "Sem restrição de tempo",
      advice: "Nível cotidiano confortável que não oferece risco de lesão auditiva."
    },
    {
      max: 85,
      example: "Trânsito intenso, aspirador de pó ou restaurante lotado",
      status: "Atenção (Limite)",
      tagClass: "warn",
      color: "var(--warn)",
      time: "Até 8 horas por dia",
      advice: "85 dB é o limite ocupacional padrão. Acima disso, a exposição prolongada começa a causar danos."
    },
    {
      max: 100,
      example: "Secador de cabelo, motocicleta ou metrô",
      status: "Perigo Moderado",
      tagClass: "warn",
      color: "var(--warn)",
      time: "De 15 minutos a 2 horas",
      advice: "Exposição frequente sem proteção pode provocar zumbido e perda auditiva gradual."
    },
    {
      max: 115,
      example: "Show de música, balada ou fone no volume máximo",
      status: "Alto Risco",
      tagClass: "danger",
      color: "var(--danger)",
      time: "Menos de 15 minutos",
      advice: "Use protetores auriculares em shows e afaste-se das caixas de som."
    },
    {
      max: 130,
      example: "Sirene próxima, britadeira ou fogos de artifício",
      status: "Risco Imediato",
      tagClass: "danger",
      color: "var(--danger)",
      time: "Menos de 1 minuto (risco de trauma acústico)",
      advice: "Nível próximo ao limiar da dor. Pode causar danos imediatos e irreversíveis."
    }
  ];

  function updateDecibelSimulator() {
    const db = Number(dbSlider.value);
    dbValue.textContent = db;

    const percentage = ((db - 30) / (130 - 30)) * 100;
    dbMeterFill.style.width = `${percentage}%`;

    const info = dbData.find((item) => db <= item.max) || dbData[dbData.length - 1];

    dbMeterFill.style.backgroundColor = info.color;
    dbExample.textContent = info.example;
    dbStatus.textContent = info.status;
    dbStatus.className = `status-tag ${info.tagClass}`;
    dbTime.textContent = info.time;
    dbAdvice.textContent = info.advice;
  }

  dbSlider.addEventListener("input", updateDecibelSimulator);
  updateDecibelSimulator();

  /* =========================================================
     4. QUIZ EDUCATIVO SOBRE SAÚDE AUDITIVA
  ========================================================= */
  const quizQuestions = [
    {
      question: "O que significa a 'Regra 60/60' recomendada para o uso de fones de ouvido?",
      options: [
        "Ouvir no máximo a 60% do volume por até 60 minutos seguidos",
        "Trocar os fones de ouvido a cada 60 dias",
        "Ouvir música a 60 dB durante 60 horas por semana"
      ],
      correct: 0,
      explanation: "Correto! Manter o volume em até 60% e fazer pausas a cada 60 minutos protege as células da orelha interna."
    },
    {
      question: "A partir de qual nível de ruído (em decibéis) a exposição prolongada de 8 horas passa a oferecer risco?",
      options: [
        "40 dB",
        "85 dB",
        "120 dB"
      ],
      correct: 1,
      explanation: "Exato! A partir de 85 dB, exposições prolongadas sem proteção podem levar à Perda Auditiva Induzida por Ruído (PAIR)."
    },
    {
      question: "Qual é o risco de usar hastes flexíveis (cotonetes) dentro do canal auditivo?",
      options: [
        "Melhora a captação de sons agudos",
        "Empurra a cera para dentro e pode perfurar o tímpano",
        "Não há nenhum risco se usado todos os dias"
      ],
      correct: 1,
      explanation: "Isso mesmo! A cera protege o ouvido. Hastes flexíveis devem ser usadas apenas na parte externa da orelha."
    },
    {
      question: "O zumbido constante no ouvido após uma festa barulhenta indica o quê?",
      options: [
        "Que o ouvido está se fortalecendo",
        "Um sinal de alerta de estresse ou lesão nas células auditivas",
        "Apenas excesso de água no ouvido"
      ],
      correct: 1,
      explanation: "Perfeito! O zumbido temporário após barulho alto é um aviso de que houve sobrecarga auditiva."
    }
  ];

  let currentQuestion = 0;
  let score = 0;

  const quizProgress = document.getElementById("quiz-progress");
  const quizQuestionEl = document.getElementById("quiz-question");
  const quizOptionsEl = document.getElementById("quiz-options");
  const quizFeedbackEl = document.getElementById("quiz-feedback");
  const quizNextBtn = document.getElementById("quiz-next");

  function renderQuestion() {
    const q = quizQuestions[currentQuestion];
    quizProgress.textContent = `Pergunta ${currentQuestion + 1} de ${quizQuestions.length}`;
    quizQuestionEl.textContent = q.question;
    quizOptionsEl.innerHTML = "";
    quizFeedbackEl.textContent = "";
    quizNextBtn.classList.add("hidden");

    q.options.forEach((optionText, index) => {
      const btn = document.createElement("button");
      btn.className = "quiz-option";
      btn.textContent = optionText;
      btn.addEventListener("click", () => handleAnswer(index, btn));
      quizOptionsEl.appendChild(btn);
    });
  }

  function handleAnswer(selectedIndex, selectedBtn) {
    const q = quizQuestions[currentQuestion];
    const allButtons = quizOptionsEl.querySelectorAll(".quiz-option");

    allButtons.forEach((btn, idx) => {
      btn.disabled = true;
      if (idx === q.correct) {
        btn.classList.add("correct");
      }
    });

    if (selectedIndex === q.correct) {
      score++;
      quizFeedbackEl.innerHTML = `✅ <strong>Parabéns!</strong> ${q.explanation}`;
    } else {
      selectedBtn.classList.add("wrong");
      quizFeedbackEl.innerHTML = `❌ <strong>Não foi dessa vez.</strong> ${q.explanation}`;
    }

    quizNextBtn.textContent =
      currentQuestion < quizQuestions.length - 1 ? "Próxima Pergunta" : "Ver Resultado Final";
    quizNextBtn.classList.remove("hidden");
  }

  quizNextBtn.addEventListener("click", () => {
    currentQuestion++;
    if (currentQuestion < quizQuestions.length) {
      renderQuestion();
    } else {
      showQuizResult();
    }
  });

  function showQuizResult() {
    quizProgress.textContent = "Quiz Concluído!";
    quizQuestionEl.textContent = `Você acertou ${score} de ${quizQuestions.length} perguntas!`;
    quizOptionsEl.innerHTML = "";
    quizFeedbackEl.textContent =
      score === quizQuestions.length
        ? "Excelente! Você domina os cuidados essenciais para manter sua audição saudável."
        : "Bom trabalho! Revise as dicas acima para proteger ainda melhor sua audição.";

    quizNextBtn.textContent = "Refazer Quiz";
    quizNextBtn.classList.remove("hidden");

    quizNextBtn.onclick = () => {
      currentQuestion = 0;
      score = 0;
      quizNextBtn.onclick = null;
      // Restaura o listener padrão
      location.hash = "#quiz";
      renderQuestion();
    };
  }

  renderQuestion();
});
