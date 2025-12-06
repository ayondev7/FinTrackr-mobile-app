import React, { useState, useCallback } from "react";
import { useOnboardingStore } from "../store/onboardingStore";
import { useToastStore } from "../store/toastStore";
import { useUpdateBalance } from "../hooks";
import { CURRENCIES } from "../constants";
import {
  TotalBalanceForm,
  DistributionForm,
  CurrencyModal,
} from "../components/balance-setup";

interface Currency {
  code: string;
  symbol: string;
  name: string;
}

export const BalanceSetupScreen: React.FC = () => {
  const [step, setStep] = useState<"total" | "distribution">("total");
  const [totalBalance, setTotalBalance] = useState<number>(0);
  const [selectedCurrency, setSelectedCurrency] = useState<Currency>(CURRENCIES[0]);
  const [showCurrencyModal, setShowCurrencyModal] = useState(false);
  const { setHasSetupBalance } = useOnboardingStore();
  const { showSuccess, showError } = useToastStore();
  const updateBalance = useUpdateBalance();

  const submitBalances = useCallback(
    async (cash: number, bank: number, digital: number, currencyCode: string) => {
      try {
        await updateBalance.mutateAsync({
          cashBalance: cash,
          bankBalance: bank,
          digitalBalance: digital,
          currency: currencyCode,
        });

        showSuccess("Balance Set!", "Your initial balance has been saved");
        setHasSetupBalance(true);
      } catch (error) {
        showError("Error", "Failed to save your balance. Please try again.");
      }
    },
    [updateBalance, showSuccess, showError, setHasSetupBalance]
  );

  const handleTotalBalanceSubmit = useCallback(
    (balance: number, currency: Currency) => {
      setSelectedCurrency(currency);
      if (balance === 0) {
        // Skip distribution if balance is 0
        submitBalances(0, 0, 0, currency.code);
      } else {
        setTotalBalance(balance);
        setStep("distribution");
      }
    },
    [submitBalances]
  );

  const handleDistributionSubmit = useCallback(
    async (cash: number, bank: number, digital: number) => {
      await submitBalances(cash, bank, digital, selectedCurrency.code);
    },
    [submitBalances, selectedCurrency]
  );

  const handleSkip = useCallback(
    (currency: Currency) => {
      submitBalances(0, 0, 0, currency.code);
    },
    [submitBalances]
  );

  const handleBackToTotal = useCallback(() => {
    setStep("total");
    setTotalBalance(0);
  }, []);

  if (step === "distribution") {
    return (
      <>
        <DistributionForm
          totalBalance={totalBalance}
          selectedCurrency={selectedCurrency}
          onSubmit={handleDistributionSubmit}
          onBack={handleBackToTotal}
          isLoading={updateBalance.isPending}
          onShowError={showError}
        />
        <CurrencyModal
          visible={showCurrencyModal}
          selectedCurrency={selectedCurrency}
          onClose={() => setShowCurrencyModal(false)}
          onSelectCurrency={setSelectedCurrency}
        />
      </>
    );
  }

  return (
    <>
      <TotalBalanceForm
        defaultCurrency={selectedCurrency}
        onSubmit={handleTotalBalanceSubmit}
        onSkip={handleSkip}
        isLoading={updateBalance.isPending}
        onOpenCurrencyModal={() => setShowCurrencyModal(true)}
      />
      <CurrencyModal
        visible={showCurrencyModal}
        selectedCurrency={selectedCurrency}
        onClose={() => setShowCurrencyModal(false)}
        onSelectCurrency={setSelectedCurrency}
      />
    </>
  );
};


