---
title: "1.2 Behavior Types"
description: "1.2 Behavior Types from 1. Conformance and Notation of the Ultraviolet language specification."
specSource: "SPECIFICATION.md"
specHash: "bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45"
specChapter: "conformance-and-notation"
specSection: "12-behavior-types"
generatedAt: "2026-05-20T01:05:16.171Z"
generated: true
---

<div class="spec-provenance">
  <strong>Generated from SPECIFICATION.md.</strong>
  <span>SHA-256: <code>bf87bbb4986d9700b5e2e916efc495553d0d1ce806f5f6f55842ecbb4a5adc45</code></span>
</div>

<div class="spec-section-context">
  <a href="/docs/specification/conformance-and-notation/">1. Conformance and Notation</a>
  <span>Conformance and Notation</span>
</div>

## 1.2 Behavior Types

**IllFormed.**

$$
\begin{array}{l}
\mathsf{StaticJudgSet}\ =\ \mathsf{WFModulePathJudg}\ \cup \ \mathsf{LinkJudg}\ \cup \ \mathsf{ParseJudgment}\ \cup \ \mathsf{ResolvePathJudg}\ \cup \ \mathsf{ResolveExprListJudg}\ \cup \ \mathsf{ResolveEnumPayloadJudg}\ \cup \ \mathsf{ResolveCalleeJudg}\ \cup \ \mathsf{ResolveIfCaseJudg}\ \cup \ \mathsf{ResolveStmtSeqJudg}\ \cup \ \mathsf{TypeEqJudg}\ \cup \ \mathsf{ConstLenJudg}\ \cup \ \mathsf{SubtypingJudg}\ \cup \ \mathsf{PermAdmitsJudg}\ \cup \ \mathsf{ArgsOkTJudg}\ \cup \ \mathsf{TypeInfJudg}\ \cup \ \mathsf{StmtJudg}\ \cup \ \mathsf{PatJudg}\ \cup \ \mathsf{ExprJudg}\ \cup \ \mathsf{CaseJudg}\ \cup \ \mathsf{DeclJudg}\ \cup \ \mathsf{BJudgment}\ \cup \ \mathsf{ArgPassJudg}\ \cup \ \mathsf{ProvPlaceJudg}\ \cup \ \mathsf{ProvExprJudg}\ \cup \ \mathsf{ProvStmtJudg}\ \cup \ \mathsf{BlockProvJudg}\ \cup \ \mathsf{ArgsOkJudg}\ \cup \ \mathsf{TypeWFJudg}\ \cup \ \mathsf{StringBytesJudg}\ \cup \ \mathsf{BitcopyDropJudg}\ \cup \ \mathsf{BitcopyJudg}\ \cup \ \mathsf{CloneJudg}\ \cup \ \mathsf{DropJudg}\ \cup \ \mathsf{FfiSafeJudg}\ \cup \ \mathsf{TypeRefsJudg}\ \cup \ \mathsf{ValueRefsJudg}\ \cup \ \mathsf{CodegenJudg}\ \cup \ \mathsf{LayoutJudg}\ \cup \ \mathsf{EncodeConstJudg}\ \cup \ \mathsf{ValidValueJudg}\ \cup \ \mathsf{RecordLayoutJudg}\ \cup \ \mathsf{UnionLayoutJudg}\ \cup \ \mathsf{TupleLayoutJudg}\ \cup \ \mathsf{RangeLayoutJudg}\ \cup \ \mathsf{EnumLayoutJudg}\ \cup \ \mathsf{ModalLayoutJudg}\ \cup \ \mathsf{DynLayoutJudg}\ \cup \ \mathsf{ABITyJudg}\ \cup \ \mathsf{ABIParamJudg}\ \cup \ \mathsf{ABIRetJudg}\ \cup \ \mathsf{ABICallJudg}\ \cup \ \mathsf{LowerCallJudg}\ \cup \ \mathsf{MangleJudg}\ \cup \ \mathsf{LinkageJudg}\ \cup \ \mathsf{EvalOrderJudg}\ \cup \ \mathsf{LowerExprJudg}\ \cup \ \mathsf{LowerStmtJudg}\ \cup \ \mathsf{PatternLowerJudg}\ \cup \ \mathsf{LowerBindJudg}\ \cup \ \mathsf{GlobalsJudg}\ \cup \ \mathsf{ConstInitJudg}\ \cup \ \mathsf{CleanupJudg}\ \cup \ \mathsf{RuntimeIfcJudg}\ \cup \ \mathsf{DynDispatchJudg}\ \cup \ \mathsf{ChecksJudg}\ \cup \ \mathsf{LLVMAttrJudg}\ \cup \ \mathsf{RuntimeDeclJudg}\ \cup \ \mathsf{LLVMTyJudg}\ \cup \ \mathsf{LLVMEmitJudg}\ \cup \ \mathsf{LowerIRJudg}\ \cup \ \mathsf{BindStorageJudg}\ \cup \ \mathsf{LLVMCallJudg}\ \cup \ \mathsf{VTableJudg}\ \cup \ \mathsf{LiteralEmitJudg}\ \cup \ \mathsf{BuiltinSymJudg}\ \cup \ \mathsf{DropHookJudg}\ \cup \ \mathsf{EntryJudg}\ \cup \ \mathsf{PoisonJudg} \\[0.16em]
\mathsf{StaticRuleSet}\ =\ \{\ r\ \mid \ \operatorname{Conclusion}(r)\ \in \ \mathsf{StaticJudgSet}\ \} \\[0.16em]
\operatorname{Conclusion}(r)\ =\ J\quad (r\ \mathsf{is}\ \mathsf{written}\ (\pi_{1} \ \ldots \ \pi_{k} )\ /\ J) \\[0.16em]
\operatorname{Premises}(r)\ =\ [\pi_{1} ,\ \ldots ,\ \pi_{k} ]\quad (r\ \mathsf{is}\ \mathsf{written}\ (\pi_{1} \ \ldots \ \pi_{k} )\ /\ \_) \\[0.16em]
\operatorname{Subject}(\Gamma \ \vdash \ j)\ =\ j_{0}\ \mathsf{where}\ j_{0}\ \mathsf{is}\ \mathsf{the}\ \mathsf{leftmost}\ \mathsf{term}\ \mathsf{to}\ \mathsf{the}\ \mathsf{right}\ \mathsf{of}\ \vdash  \\[0.16em]
\operatorname{EnvOf}(\Gamma \ \vdash \ j)\ =\ \Gamma  \\[0.16em]
\theta \ \mathsf{ranges}\ \mathsf{over}\ \mathsf{substitutions}\ \mathsf{of}\ \mathsf{metavariables}\ \mathsf{in}\ r \\[0.16em]
\operatorname{Applies}(r,\ x)\ \Leftrightarrow \ \exists \ \theta .\ \operatorname{Subject}(\operatorname{Conclusion}(r)[\theta ])\ =\ x \\[0.16em]
\operatorname{PremisesHold}(r,\ x)\ \Leftrightarrow \ \exists \ \theta .\ \operatorname{Subject}(\operatorname{Conclusion}(r)[\theta ])\ =\ x\ \land \ \Gamma_{r} \ =\ \operatorname{EnvOf}(\operatorname{Conclusion}(r)[\theta ])\ \land \ \forall \ \pi \ \in \ \operatorname{Premises}(r)[\theta ].\ \pi \ \ne \ \bot \ \land \ (\pi \ \mathsf{is}\ a\ \mathsf{judgment}\ \Rightarrow \ \Gamma_{r} \ \vdash \ \pi ) \\[0.16em]
\operatorname{IllFormed}(x)\ \Leftrightarrow \ \exists \ r\ \in \ \mathsf{StaticRuleSet}.\ \operatorname{Applies}(r,\ x)\ \land \ \lnot \ \operatorname{PremisesHold}(r,\ x)
\end{array}
$$

**Undefinedness Policy.**

$$
\operatorname{StaticUndefined}(J)\ \Leftrightarrow \ \exists \ r.\ \operatorname{Conclusion}(r)\ =\ J\ \land \ \exists \ \pi \ \in \ \operatorname{Premises}(r).\ \pi \ =\ \bot 
$$

$$
\begin{array}{l}
\operatorname{RuleId}(r)\ =\ \mathsf{id}\ \Leftrightarrow \ r\ \mathsf{is}\ \mathsf{labeled}\ (\mathsf{id}) \\[0.16em]
\operatorname{DiagIdOf}(J)\ =\ \mathsf{id}\ \Leftrightarrow \ \exists \ r.\ \operatorname{Conclusion}(r)\ =\ J\ \land \ \operatorname{RuleId}(r)\ =\ \mathsf{id} \\[0.16em]
\operatorname{DiagIdOf}(J)\ =\ \bot \ \Leftrightarrow \ \lnot \ \exists \ r.\ \operatorname{Conclusion}(r)\ =\ J\ \land \ \operatorname{RuleId}(r)\ \mathsf{defined} \\[0.16em]
\operatorname{SectionId}(r)\ \in \ \mathsf{String} \\[0.16em]
\operatorname{RulesIn}(\Sigma )\ =\ \{\ r\ \mid \ \operatorname{SectionId}(r)\ \in \ \Sigma \ \}
\end{array}
$$

**(Static-Undefined)**

$$
\begin{array}{l}
\operatorname{StaticUndefined}(J)\quad \operatorname{Code}(\operatorname{DiagIdOf}(J))\ =\ c \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ J\ \Uparrow \ c
\end{array}
$$

**(Static-Undefined-NoCode)**

$$
\begin{array}{l}
\operatorname{StaticUndefined}(J)\quad \operatorname{Code}(\operatorname{DiagIdOf}(J))\ =\ \bot  \\[0.16em]
\rule{18em}{0.4pt} \\[0.16em]
\Gamma \ \vdash \ J\ \Uparrow 
\end{array}
$$

**OutsideConformance.**
If OutsideConformance holds, this specification imposes no requirements on observable behavior, diagnostics, or termination. Implementations MAY exhibit any behavior.

**Static vs. Runtime Checks.**

$$
\mathsf{CheckKind}\ =\ \{\mathsf{PatternExhaustiveness},\ \mathsf{TypeCompatibility},\ \mathsf{PermissionViolations},\ \mathsf{ProvenanceEscape},\ \mathsf{ArrayBounds},\ \mathsf{SafePointerValidity},\ \mathsf{IntegerOverflow},\ \mathsf{SliceBounds},\ \mathsf{IntDivisionByZero}\}
$$

$$
\begin{array}{l}
\mathsf{StaticCheck}\ =\ \{\mathsf{PatternExhaustiveness},\ \mathsf{TypeCompatibility},\ \mathsf{PermissionViolations},\ \mathsf{ProvenanceEscape},\ \mathsf{ArrayBounds},\ \mathsf{SafePointerValidity}\} \\[0.16em]
\mathsf{RuntimeCheck}\ =\ \{\mathsf{IntegerOverflow},\ \mathsf{SliceBounds},\ \mathsf{IntDivisionByZero}\}
\end{array}
$$

$$
\begin{array}{l}
\operatorname{RuntimeBehavior}(\mathsf{IntegerOverflow})\ =\ \mathsf{Panic} \\[0.16em]
\operatorname{RuntimeBehavior}(\mathsf{SliceBounds})\ =\ \mathsf{Panic} \\[0.16em]
\operatorname{RuntimeBehavior}(\mathsf{IntDivisionByZero})\ =\ \mathsf{Panic}
\end{array}
$$

$$
\mathsf{ResourceExhaustion}\ \Rightarrow \ \mathsf{OutsideConformance}
$$

**Error Recovery.**

$$
\begin{array}{l}
\mathsf{LexRecovery}\ =\ \mathsf{SkipToNextTokenStart} \\[0.16em]
\mathsf{ParseRecovery}\ =\ \operatorname{SyncSet}(\{\texttt{;},\ \texttt{\}},\ \texttt{EOF}\}) \\[0.16em]
\mathsf{TypeRecovery}\ =\ \mathsf{ContinueDecls} \\[0.16em]
\mathsf{MaxErrorCount}\ \in \ \mathbb{N} \ \cup \ \{\infty \}
\end{array}
$$
SuggestedMaxErrorCount = 100

$$
\operatorname{AbortOnErrorCount}(n)\ \Leftrightarrow \ n\ \ge \ \mathsf{MaxErrorCount}
$$
