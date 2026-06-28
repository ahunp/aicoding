export default function AdminLoading() {
  return (
    <div className="flex items-center justify-center py-20">
      <div className="text-center">
        <div className="mx-auto h-8 w-8 animate-spin rounded-full border-4 border-border border-t-primary-600" />
        <p className="mt-4 text-sm text-muted-foreground">加载中...</p>
      </div>
    </div>
  );
}
