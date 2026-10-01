import Link from "next/link";
import { Container } from "@/components/layout/Container";

export default function NotFound() {
  return <Container className="case-study"><div className="case-hero">
    <p className="section-label">404 / Page not found</p>
    <h1 className="case-title">Nothing here.</h1>
    <p className="case-description">This page could not be found.</p>
    <Link className="case-back" href="/#work" data-cursor="EXPLORE">Back to projects ↗</Link>
  </div></Container>;
}
