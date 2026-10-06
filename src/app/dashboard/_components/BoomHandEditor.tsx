type BoomHandEditorProps = {
  defaultValue: string;
};

export function BoomHandEditor({ defaultValue }: BoomHandEditorProps) {
  return (
    <div className="flex w-full flex-col gap-3">
      <div className="rounded bg-secondary/15 p-2 text-center text-sm">
        Boom Hands
      </div>

      <textarea
        name="boomHands"
        defaultValue={defaultValue}
        placeholder="Enter boom hand types (separated by commas)..."
        className="no-scrollbar h-20 resize-none rounded border-2 p-1 text-xs outline-none"
      />
    </div>
  );
}
