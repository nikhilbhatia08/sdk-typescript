// @@@SNIPSTART nodejs-nested-cancellation-scopes
import { CancellationError, CancellationScope } from '@temporalio/workflow';
import { setup, httpPostJSON, cleanup } from '@activities';

export async function main(url: string): Promise<void> {
  await CancellationScope.cancellable(async () => {
    await CancellationScope.nonCancellable(() => setup());
    try {
      await CancellationScope.withTimeout(1000, () => httpPostJSON(url, { some: 'data' }));
    } catch (err) {
      if (err instanceof CancellationError) {
        await CancellationScope.nonCancellable(() => cleanup(url));
      }
      throw err;
    }
  });
}
// @@@SNIPEND