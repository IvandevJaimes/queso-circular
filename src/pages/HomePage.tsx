import { useEffect, useState } from 'react';
import { AlternativaModal } from '../components/domain/AlternativaModal';
import { CalculadoraForm } from '../components/domain/CalculadoraForm';
import { ChatAsistenteIA } from '../components/domain/ChatAsistenteIA';
import { RecetaModal } from '../components/domain/RecetaModal';
import { ALTERNATIVAS } from '../config/constants';
import { useAppStore } from '../store/useAppStore';
import type { Alternativa, AlternativaId } from '../types/produccion.types';
import type { RecetaLocal } from '../types/receta.types';

export function HomePage() {
  const litrosInput = useAppStore((state) => state.litrosInput);
  const ultimaEstimacion = useAppStore((state) => state.ultimaEstimacion);
  const chatMessages = useAppStore((state) => state.chatMessages);
  const chatConsultadoLitros = useAppStore(
    (state) => state.chatConsultadoLitros,
  );
  const isChatLoading = useAppStore((state) => state.isChatLoading);
  const isChatExpanded = useAppStore((state) => state.isChatExpanded);
  const isSaving = useAppStore((state) => state.isSavingProduccion);

  const setLitrosInput = useAppStore((state) => state.setLitrosInput);
  const guardarProduccion = useAppStore((state) => state.guardarProduccion);
  const enviarConsultaChat = useAppStore((state) => state.enviarConsultaChat);
  const limpiarChat = useAppStore((state) => state.limpiarChat);
  const toggleChatExpanded = useAppStore((state) => state.toggleChatExpanded);
  const setChatExpanded = useAppStore((state) => state.setChatExpanded);

  const [alternativaModal, setAlternativaModal] = useState<Alternativa | null>(
    null,
  );
  const [recetaModal, setRecetaModal] = useState<RecetaLocal | null>(null);

  const litrosActuales = ultimaEstimacion?.litrosLeche ?? 0;
  const sueroActual = ultimaEstimacion?.sueroEstimado ?? 0;

  useEffect(() => {
    if (litrosActuales <= 0 || isChatLoading) return;
    if (litrosActuales === chatConsultadoLitros) return;

    const timer = window.setTimeout(() => {
      void enviarConsultaChat(litrosActuales);
    }, 650);

    return () => window.clearTimeout(timer);
  }, [litrosActuales, chatConsultadoLitros, isChatLoading, enviarConsultaChat]);

  const handleSelectPreset = (litros: number) => {
    setLitrosInput(String(litros));
    void enviarConsultaChat(litros);
  };

  const handleConsultarIA = (litros: number) => {
    void enviarConsultaChat(
      litros,
      `¿Qué me recomiendas hacer con los ${(litros * 0.88).toFixed(1).replace('.', ',')} L de suero de esta partida?`,
    );
  };

  const handleOpenAlternativa = (id: AlternativaId) => {
    const encontrada = ALTERNATIVAS.find((alt) => alt.id === id) ?? null;
    setAlternativaModal(encontrada);
  };

  return (
    <div className="mx-auto flex max-w-4xl flex-col gap-4">
      <CalculadoraForm
        litrosInput={litrosInput}
        estimacion={ultimaEstimacion}
        isSaving={isSaving}
        isChatLoading={isChatLoading}
        onChangeLitros={setLitrosInput}
        onSelectPreset={handleSelectPreset}
        onConsultarIA={handleConsultarIA}
        onSave={async (litros) => {
          await guardarProduccion(litros);
        }}
      />

      <ChatAsistenteIA
        litrosLeche={litrosActuales}
        sueroEstimado={sueroActual}
        messages={chatMessages}
        isLoading={isChatLoading}
        isExpanded={isChatExpanded}
        onToggleExpand={toggleChatExpanded}
        onCloseExpand={() => setChatExpanded(false)}
        onSendQuestion={(pregunta) => {
          void enviarConsultaChat(
            litrosActuales > 0 ? litrosActuales : undefined,
            pregunta,
          );
        }}
        onClearChat={limpiarChat}
        onOpenAlternativa={handleOpenAlternativa}
        onOpenReceta={setRecetaModal}
      />

      <AlternativaModal
        alternativa={alternativaModal}
        onClose={() => setAlternativaModal(null)}
      />

      <RecetaModal
        receta={recetaModal}
        onClose={() => setRecetaModal(null)}
      />
    </div>
  );
}
