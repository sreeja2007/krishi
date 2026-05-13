import { useLang } from '../../context/LangContext';

export default function SuggestedQuestions({ questions, onSelect }) {
  const { t } = useLang();
  if (!questions?.length) return null;
  return (
    <div className="px-6 pb-4">
      <p className="text-sm text-gray-400 mb-2">{t('suggestedFollowups')}</p>
      <div className="flex flex-wrap gap-2">
        {questions.map((q, i) => (
          <button key={i} onClick={() => onSelect(q)}
            className="text-sm bg-forest-50 text-forest-700 border border-forest-200 px-4 py-2 rounded-full hover:bg-forest-100 transition-colors text-left">
            {q}
          </button>
        ))}
      </div>
    </div>
  );
}
