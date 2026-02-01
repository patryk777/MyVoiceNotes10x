import { render, screen, fireEvent } from "@testing-library/react";
import { SettingsModal } from "@/components/SettingsModal";
import { Settings } from "@/hooks/useSettings";

const mockSettings: Settings = {
  appLanguage: "pl",
  defaultTranslationLanguage: "angielski",
  maxRecordingSeconds: 60,
};

const mockT = (key: string) => {
  const translations: Record<string, string> = {
    settings: "Ustawienia",
    appLanguageLabel: "Język interfejsu",
    translationLanguageLabel: "Domyślny język tłumaczenia",
    maxRecordingLabel: "Maksymalny czas nagrania",
    seconds: "sek",
    minutes: "min",
    close: "Zamknij",
  };
  return translations[key] || key;
};

describe("SettingsModal", () => {
  const mockOnUpdate = jest.fn();
  const mockOnClose = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it("should render settings title", () => {
    render(
      <SettingsModal
        settings={mockSettings}
        onUpdate={mockOnUpdate}
        onClose={mockOnClose}
        t={mockT}
      />
    );
    expect(screen.getByText("Ustawienia")).toBeInTheDocument();
  });

  it("should render language buttons", () => {
    render(
      <SettingsModal
        settings={mockSettings}
        onUpdate={mockOnUpdate}
        onClose={mockOnClose}
        t={mockT}
      />
    );
    expect(screen.getByRole("button", { name: /Polski/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: /English/i })).toBeInTheDocument();
  });

  it("should render translation language dropdown", () => {
    render(
      <SettingsModal
        settings={mockSettings}
        onUpdate={mockOnUpdate}
        onClose={mockOnClose}
        t={mockT}
      />
    );
    expect(screen.getByRole("combobox")).toBeInTheDocument();
  });

  it("should render recording time slider", () => {
    render(
      <SettingsModal
        settings={mockSettings}
        onUpdate={mockOnUpdate}
        onClose={mockOnClose}
        t={mockT}
      />
    );
    expect(screen.getByRole("slider")).toBeInTheDocument();
  });

  it("should call onUpdate when language changed", () => {
    render(
      <SettingsModal
        settings={mockSettings}
        onUpdate={mockOnUpdate}
        onClose={mockOnClose}
        t={mockT}
      />
    );
    
    fireEvent.click(screen.getByRole("button", { name: /English/i }));
    
    expect(mockOnUpdate).toHaveBeenCalledWith({ appLanguage: "en" });
  });

  it("should call onUpdate when translation language changed", () => {
    render(
      <SettingsModal
        settings={mockSettings}
        onUpdate={mockOnUpdate}
        onClose={mockOnClose}
        t={mockT}
      />
    );
    
    fireEvent.change(screen.getByRole("combobox"), { target: { value: "niemiecki" } });
    
    expect(mockOnUpdate).toHaveBeenCalledWith({ defaultTranslationLanguage: "niemiecki" });
  });

  it("should call onUpdate when slider changed", () => {
    render(
      <SettingsModal
        settings={mockSettings}
        onUpdate={mockOnUpdate}
        onClose={mockOnClose}
        t={mockT}
      />
    );
    
    fireEvent.change(screen.getByRole("slider"), { target: { value: "120" } });
    
    expect(mockOnUpdate).toHaveBeenCalledWith({ maxRecordingSeconds: 120 });
  });

  it("should call onClose when close button clicked", () => {
    render(
      <SettingsModal
        settings={mockSettings}
        onUpdate={mockOnUpdate}
        onClose={mockOnClose}
        t={mockT}
      />
    );
    
    fireEvent.click(screen.getByRole("button", { name: /Zamknij/i }));
    
    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should display current recording time", () => {
    render(
      <SettingsModal
        settings={mockSettings}
        onUpdate={mockOnUpdate}
        onClose={mockOnClose}
        t={mockT}
      />
    );
    
    expect(screen.getByText(/1 min/)).toBeInTheDocument();
  });

  it("should show slider range labels", () => {
    render(
      <SettingsModal
        settings={mockSettings}
        onUpdate={mockOnUpdate}
        onClose={mockOnClose}
        t={mockT}
      />
    );
    
    expect(screen.getByText("10 sek")).toBeInTheDocument();
    expect(screen.getByText("5 min")).toBeInTheDocument();
  });
});
