package com.example;

/**
 * Aplicação Java simples para demonstrar multi-stage build.
 * 
 * Este código será compilado no estágio de build e executado
 * no estágio de runtime (JRE Alpine).
 */
public class App {
    public static void main(String[] args) {
        System.out.println("");
        System.out.println("   Hello Multi-Stage                    ");
        System.out.println("   DevOps - Atividade 04                ");
        System.out.println("");
        System.out.println();
        System.out.println(" Aplicação Java executando com sucesso!");
        System.out.println(" Imagem otimizada com multi-stage build");
        
        // Informações do runtime
        System.out.println("\n Informações do ambiente:");
        System.out.println("   Java Version: " + System.getProperty("java.version"));
        System.out.println("   Java Vendor: " + System.getProperty("java.vendor"));
        System.out.println("   OS: " + System.getProperty("os.name"));
    }
}
