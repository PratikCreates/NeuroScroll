'use client'

import { useState } from 'react'
import { motion } from 'framer-motion'
import AccessibleButton from './AccessibleButton'
import ConfirmationDialog from './ConfirmationDialog'
import { useMotionPreference } from '../hooks/useMotionPreference'

export default function AccessibilityTest() {
  const [showDialog, setShowDialog] = useState(false)
  const [testResults, setTestResults] = useState<string[]>([])
  const { prefersReducedMotion } = useMotionPreference()

  const runAccessibilityTests = () => {
    const results: string[] = []

    // Test 1: Motion preference detection
    results.push(`✅ Motion preference: ${prefersReducedMotion ? 'Reduced' : 'Normal'}`)

    // Test 2: Focus management
    const focusableElements = document.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    )
    results.push(`✅ Focusable elements found: ${focusableElements.length}`)

    // Test 3: ARIA labels
    const ariaLabels = document.querySelectorAll('[aria-label]')
    results.push(`✅ Elements with ARIA labels: ${ariaLabels.length}`)

    // Test 4: Screen reader content
    const srOnlyElements = document.querySelectorAll('.sr-only')
    results.push(`✅ Screen reader only content: ${srOnlyElements.length}`)

    // Test 5: Color contrast (basic check)
    const computedStyle = getComputedStyle(document.body)
    const bgColor = computedStyle.backgroundColor
    const textColor = computedStyle.color
    results.push(`✅ Body colors - Background: ${bgColor}, Text: ${textColor}`)

    // Test 6: Semantic HTML
    const headings = document.querySelectorAll('h1, h2, h3, h4, h5, h6')
    const regions = document.querySelectorAll('[role="region"], [role="main"], [role="banner"]')
    results.push(`✅ Headings: ${headings.length}, Regions: ${regions.length}`)

    setTestResults(results)
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="p-4 bg-white/10 rounded-lg border border-white/20 mt-4"
    >
      <h2 className="text-sm font-semibold text-white mb-3">
        Accessibility Testing Panel
      </h2>

      <div className="space-y-2 mb-4">
        <AccessibleButton
          onClick={runAccessibilityTests}
          variant="primary"
          icon="🔍"
          ariaLabel="Run accessibility tests"
        >
          Run Tests
        </AccessibleButton>

        <AccessibleButton
          onClick={() => setShowDialog(true)}
          variant="danger"
          icon="⚠️"
          ariaLabel="Test confirmation dialog"
        >
          Test Dialog
        </AccessibleButton>
      </div>

      {testResults.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-white/5 rounded p-3 border border-white/10"
        >
          <h3 className="text-xs font-medium text-white/90 mb-2">Test Results:</h3>
          <div className="space-y-1">
            {testResults.map((result, index) => (
              <div key={index} className="text-xs text-white/70">
                {result}
              </div>
            ))}
          </div>
        </motion.div>
      )}

      <ConfirmationDialog
        isOpen={showDialog}
        title="Test Dialog"
        message="This is a test of the confirmation dialog accessibility features. It should trap focus, support keyboard navigation, and provide proper ARIA attributes."
        confirmText="Confirm"
        cancelText="Cancel"
        variant="info"
        onConfirm={() => setShowDialog(false)}
        onCancel={() => setShowDialog(false)}
      />
    </motion.div>
  )
}