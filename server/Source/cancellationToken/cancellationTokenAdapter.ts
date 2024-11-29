// Copyright (c) Microsoft Corporation.
// Licensed under the MIT license.

import * as PQP from "@microsoft/powerquery-parser";
import * as LS from "vscode-languageserver/node";

export class CancellationTokenAdapter implements PQP.ICancellationToken {
	private cancelReason: string | undefined;

	constructor(
		protected readonly parserCancellationToken: PQP.ICancellationToken,
		protected readonly languageServerCancellationToken: LS.CancellationToken,
	) {}

	public isCancelled(): boolean {
		return (
			this.parserCancellationToken.isCancelled() ||
			this.languageServerCancellationToken.isCancellationRequested
		);
	}

	public throwIfCancelled(): void {
		if (this.isCancelled()) {
			this.parserCancellationToken.cancel(
				this.cancelReason ?? "Language server cancellation requested",
			);

			this.parserCancellationToken.throwIfCancelled();
		}
	}

	public cancel(reason: string): void {
		this.cancelReason = reason;

		this.parserCancellationToken.cancel(reason);
	}
}
