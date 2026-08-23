type BoomHandEditorProps = {
  boomHands: string;
  setBoomHands: (boomHands: string) => void;
};

export function BoomHandEditor({
  boomHands,
  setBoomHands,
}: BoomHandEditorProps) {
  return (
    <>
      <div className="w-full rounded bg-white/10 p-2 text-center text-sm">
        Boom Hands
      </div>

      <textarea
        value={boomHands}
        placeholder="Enter boom hand types (separated by commas)..."
        onChange={(e) => setBoomHands(e.target.value)}
        className="no-scrollbar h-30 w-full resize-none rounded border-2 p-1 text-xs outline-none"
      />
    </>
  );
}
