# 🧪 Testes Auth - Estrutura Granular

## 📁 **Estrutura Organizada:**

```
src/hooks/__tests__/use-auth/
├── 📁 register/              # Testes de registro
├── 📁 login/                 # Testes de login
├── 📁 loading-states/        # Estados de loading  
├── 📁 security/              # Testes de segurança
├── 📁 integration/           # Testes de integração
├── 📁 edge-cases/            # Casos extremos
├── 📁 shared/                # Recursos compartilhados
│   ├── setup.tsx             # ✅ Setup comum
│   ├── mocks.tsx             # ✅ Mocks compartilhados  
│   ├── fixtures.ts           # ✅ Dados de teste
│   └── utils.tsx             # ✅ Utilidades de teste
└── README.md                 # Esta documentação
```

## 🎯 **Plano de Implementação:**

### **Prioridade Alta:**
1. **register/** - Testes críticos de registro
2. **login/** - Testes críticos de login  
3. **security/** - Testes de segurança

### **Prioridade Média:**
4. **loading-states/** - Estados de loading
5. **integration/** - Fluxos completos

### **Prioridade Baixa:**
6. **edge-cases/** - Casos extremos

## 📋 **Scripts Disponíveis:**

```bash
# Todos os testes auth
pnpm test:auth

# Por categoria
pnpm test:auth:register
pnpm test:auth:login  
pnpm test:auth:security
pnpm test:auth:integration
```

## ✅ **Infraestrutura Pronta:**

- **Setup compartilhado**: QueryClient, mocks, cleanup
- **Fixtures**: Dados de teste padronizados
- **Utils**: Helpers para assertions e waits  
- **Mocks**: LocalStorage, axios, window objects
- **TypeScript**: Configuração completa
- **Vitest**: Framework configurado

## 🚀 **Próximos Passos:**

1. Implementar testes por pasta seguindo os padrões estabelecidos
2. Usar os recursos compartilhados em `/shared/`
3. Manter testes focados e independentes
4. Documentar casos específicos em cada pasta

**Status: 🏗️ Estrutura criada e pronta para implementação!**