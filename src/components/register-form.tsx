import { useState } from 'react'
import { Link } from 'react-router-dom'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { PasswordInput } from '@/components/ui/password-input'
import { registerSchema, type RegisterFormData } from '@/lib/validation'

export function RegisterForm() {
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [touched, setTouched] = useState<
    Partial<Record<keyof RegisterFormData, boolean>>
  >({})

  const result = registerSchema.safeParse({
    name: fullName,
    email,
    password,
    confirmPassword,
  })
  const isValid = result.success
  const fieldErrors = result.success ? {} : z.flattenError(result.error).fieldErrors

  const nameError = touched.name ? fieldErrors.name?.[0] : undefined
  const emailError = touched.email ? fieldErrors.email?.[0] : undefined
  const passwordError = touched.password ? fieldErrors.password?.[0] : undefined
  const confirmPasswordError = touched.confirmPassword
    ? fieldErrors.confirmPassword?.[0]
    : undefined

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!result.success) return
    console.log('register submitted', result.data)
  }

  return (
    <Card className="w-full max-w-sm">
      <CardHeader>
        <CardTitle className="text-2xl">Register</CardTitle>
        <CardDescription>Create a new account to get started</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="flex flex-col gap-4" noValidate>
          <div className="grid gap-2">
            <Label htmlFor="full-name">Full Name</Label>
            <Input
              id="full-name"
              name="name"
              type="text"
              placeholder="John Doe"
              autoComplete="name"
              value={fullName}
              onChange={(e) => {
                setFullName(e.target.value)
                setTouched((prev) => ({ ...prev, name: true }))
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, name: true }))}
              aria-invalid={Boolean(nameError)}
              aria-describedby={nameError ? 'name-error' : undefined}
            />
            {nameError && (
              <p id="name-error" className="text-sm text-destructive">
                {nameError}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="email">Email</Label>
            <Input
              id="email"
              name="email"
              type="email"
              placeholder="m@example.com"
              autoComplete="email"
              value={email}
              onChange={(e) => {
                setEmail(e.target.value)
                setTouched((prev) => ({ ...prev, email: true }))
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              aria-invalid={Boolean(emailError)}
              aria-describedby={emailError ? 'email-error' : undefined}
            />
            {emailError && (
              <p id="email-error" className="text-sm text-destructive">
                {emailError}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="password">Password</Label>
            <PasswordInput
              id="password"
              name="password"
              autoComplete="new-password"
              value={password}
              onChange={(e) => {
                setPassword(e.target.value)
                setTouched((prev) => ({ ...prev, password: true }))
              }}
              onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
              aria-invalid={Boolean(passwordError)}
              aria-describedby={passwordError ? 'password-error' : undefined}
            />
            {passwordError && (
              <p id="password-error" className="text-sm text-destructive">
                {passwordError}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirm-password">Confirm Password</Label>
            <PasswordInput
              id="confirm-password"
              name="confirmPassword"
              autoComplete="new-password"
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value)
                setTouched((prev) => ({ ...prev, confirmPassword: true }))
              }}
              onBlur={() =>
                setTouched((prev) => ({ ...prev, confirmPassword: true }))
              }
              aria-invalid={Boolean(confirmPasswordError)}
              aria-describedby={
                confirmPasswordError ? 'confirm-password-error' : undefined
              }
            />
            {confirmPasswordError && (
              <p id="confirm-password-error" className="text-sm text-destructive">
                {confirmPasswordError}
              </p>
            )}
          </div>
          <Button type="submit" className="w-full" disabled={!isValid}>
            Register
          </Button>
        </form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        Already have an account?&nbsp;
        <Link
          to="/login"
          className="font-medium text-primary underline-offset-4 hover:underline"
        >
          Login
        </Link>
      </CardFooter>
    </Card>
  )
}
